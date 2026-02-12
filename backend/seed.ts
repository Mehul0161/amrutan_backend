import prisma from './src/config/db';
import bcrypt from 'bcryptjs';

async function main() {
    console.log('Seeding database...');

    // 1. Create Admin
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@amrutam.com' },
        update: {},
        create: {
            email: 'admin@amrutam.com',
            name: 'System Admin',
            passwordHash: adminPassword,
            role: 'ADMIN',
        },
    });
    console.log('Admin created:', admin.email);

    // 2. Create Doctors
    const doctorPassword = await bcrypt.hash('doctor123', 12);
    const doctorsData = [
        { email: 'dr.sharma@amrutam.com', name: 'Dr. Sharma', specialty: 'Ayurveda' },
        { email: 'dr.verma@amrutam.com', name: 'Dr. Verma', specialty: 'General Physician' },
    ];

    for (const doc of doctorsData) {
        const user = await prisma.user.upsert({
            where: { email: doc.email },
            update: {},
            create: {
                email: doc.email,
                name: doc.name,
                passwordHash: doctorPassword,
                role: 'DOCTOR',
                doctorProfile: {
                    create: {
                        specialty: doc.specialty,
                        bio: `Experienced specialist in ${doc.specialty}`,
                        rating: 4.5,
                    },
                },
            },
            include: { doctorProfile: true },
        });
        console.log(`Doctor created: ${user.name}`);

        // Create some availability slots for today
        if (user.doctorProfile) {
            const today = new Date();
            today.setHours(10, 0, 0, 0);

            await prisma.availabilitySlot.createMany({
                data: [
                    {
                        doctorId: user.doctorProfile.id,
                        startTime: new Date(today.getTime() + 1 * 60 * 60 * 1000), // 11 AM
                        endTime: new Date(today.getTime() + 2 * 60 * 60 * 1000),   // 12 PM
                    },
                    {
                        doctorId: user.doctorProfile.id,
                        startTime: new Date(today.getTime() + 4 * 60 * 60 * 1000), // 2 PM
                        endTime: new Date(today.getTime() + 5 * 60 * 60 * 1000),   // 3 PM
                    },
                ],
            });
        }
    }

    // 3. Create a Test Patient
    const patientPassword = await bcrypt.hash('patient123', 12);
    const patient = await prisma.user.upsert({
        where: { email: 'patient@example.com' },
        update: {},
        create: {
            email: 'patient@example.com',
            name: 'John Doe',
            passwordHash: patientPassword,
            role: 'PATIENT',
        },
    });
    console.log('Patient created:', patient.email);

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
