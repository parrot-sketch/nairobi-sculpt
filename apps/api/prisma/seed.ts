import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDoctors() {
  console.log('🏥 Seeding Master Doctors...');

  const doctors = [
    {
      email: 'dr.jpogalo@nairobi-sculpt.com',
      name: 'Dr. John Paul Ogalo',
      title: 'Consultant Plastic Surgeon',
      specialization: 'Body Contouring, Facial Aesthetics, Reconstructive Surgery',
      bio: 'Consultant Plastic Surgeon with over a decade of expertise. Head of Plastic Surgery at Nairobi Hospital. Pioneered Kenya\'s first Pygopagus separation surgery.',
      licenseNumber: 'KMC-JPO-2021-001',
    },
    {
      email: 'dr.amuoki@nairobi-sculpt.com',
      name: 'Dr. Angela Muoki',
      title: 'Consultant Plastic, Reconstructive and Aesthetic Surgeon',
      specialization: 'Breast Surgery, Scar Management, Reconstructive Surgery, Pediatric Plastic Surgery',
      bio: 'Board Certified Specialist with 12 years of extensive experience. Head of Department at Defence Forces Memorial Hospital.',
      licenseNumber: 'KMC-AMU-2021-002',
    },
    {
      email: 'dr.mgathariki@nairobi-sculpt.com',
      name: 'Dr. Mukami Gathariki',
      title: 'Consultant Plastic, Reconstructive and Aesthetic Surgeon',
      specialization: 'Facial Aesthetics, Rhinoplasty, Facelifts, Cleft Lip and Palate',
      bio: 'Highly accomplished Board Certified surgeon with 8+ years of progressive experience.',
      licenseNumber: 'KMC-MGA-2021-003',
    },
    {
      email: 'dr.kaluora@nairobi-sculpt.com',
      name: 'Dr. Ken Aluora',
      title: 'Consultant Plastic Surgeon',
      specialization: 'Breast Surgery, Non-Surgical Treatments, Aesthetic Surgery, Reconstructive Surgery',
      bio: 'Renowned for expertise in non-surgical treatments, aesthetic surgery, reconstructive surgery, and wound care.',
      licenseNumber: 'KMC-KAL-2021-004',
    },
    {
      email: 'dr.djowi@nairobi-sculpt.com',
      name: 'Dr. Dorsi Jowi',
      title: 'Consultant Plastic Surgeon',
      specialization: 'Hand Surgery, Reconstructive Surgery, Peripheral Nerve Surgery, Brachial Plexus Surgery',
      bio: 'Consultant Plastic Surgeon in private practice with sub-specialization in hand surgery.',
      licenseNumber: 'KMC-DJO-2021-005',
    }
  ];

  for (const doc of doctors) {
    const password = await bcrypt.hash('doctor123', 10);
    
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        email: doc.email,
        password,
        name: doc.name,
        role: UserRole.DOCTOR,
        isActive: true,
        userProfile: {
          create: {
            licenseNumber: doc.licenseNumber,
            specialization: doc.specialization,
            bio: doc.bio,
          },
        },
      },
    });

    const doctor = await prisma.doctor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
      },
    });

    console.log(`✅ Created ${doc.name} - Doctor ID: ${doctor.id}`);
  }
}

async function seedPatients() {
  console.log('\n👥 Seeding Patient Records...');

  const patients = [
    {
      fileNo: 'NS001',
      name: 'MILLICENT WANJIKU MUCHIRI',
      age: 22,
      dob: new Date('2002-08-06'),
      email: 'millicent.wanjiku@email.com',
      phone: '796470234',
      occupation: 'Student',
      drugAllergies: 'N/A',
      residence: 'KIRINYAGA',
      nextOfKin: 'Sister',
      kinPhone: '796508862',
    },
    {
      fileNo: 'NS002',
      name: 'RHODA ATIENO',
      age: 41,
      dob: new Date('1983-05-14'),
      email: 'RHODHAOTI@GMAIL.COM',
      phone: '714356256',
      occupation: 'CIVIL SERVANT',
      drugAllergies: 'NONE',
      residence: 'SOUTH B',
      nextOfKin: 'Friend',
      kinPhone: '706415824',
    },
    {
      fileNo: 'NS003',
      name: 'SANDRA NYAKIONGORA',
      age: 35,
      dob: new Date('1990-05-14'),
      email: 'sandra.nyaki@email.com',
      phone: '702334455',
      occupation: 'LAWYER',
      drugAllergies: 'NONE',
      residence: 'Nairobi',
      nextOfKin: 'SARAH NYAKINGORA',
      kinPhone: '702334455',
    },
    {
      fileNo: 'NS004',
      name: 'SHAMIA NALUGO',
      age: 34,
      dob: new Date('1990-01-15'),
      email: 'shamia.nalugo@email.com',
      phone: '774569871',
      occupation: 'BUSINESS WOMAN',
      drugAllergies: 'NONE',
      residence: 'UGANDA',
      nextOfKin: 'SYLVIA',
      kinPhone: '774117974',
    },
    {
      fileNo: 'NS005',
      name: 'LORNA SOLOPIAN',
      age: 37,
      dob: new Date('1978-11-01'),
      email: 'SOLOPIANLORNAH@GMAIL.COM',
      phone: '724771694',
      occupation: 'ADVOCATE',
      drugAllergies: 'NONE',
      residence: 'NAIROBI',
      nextOfKin: 'AMOS',
      kinPhone: '721279052',
    },
    {
      fileNo: 'NS006',
      name: 'SHARON MOMANYI',
      age: 36,
      dob: new Date('1988-04-23'),
      email: 'NYANCHAMAR@GMAIL.COM',
      phone: '726744907',
      occupation: 'JOURNALIST',
      drugAllergies: 'NONE',
      residence: 'NAIROBI',
      nextOfKin: 'REUBEN',
      kinPhone: '722556555',
    },
    {
      fileNo: 'NS007',
      name: 'DYLAN NGUGI',
      age: 2,
      dob: new Date('2024-02-27'),
      email: 'dylan.ngugi@email.com',
      phone: '799765774',
      occupation: 'Child',
      drugAllergies: 'N/A',
      residence: 'KIAMBU TOWN',
      nextOfKin: 'Mother',
      kinPhone: '799765774',
    },
    {
      fileNo: 'NS008',
      name: 'BRENDA ATIENO',
      age: 33,
      dob: new Date('1991-02-06'),
      email: 'BBITTAH@GMAIL.COM',
      phone: '724538234',
      occupation: 'SELF EMPLOYED',
      drugAllergies: 'NONE',
      residence: 'NAIROBI',
      nextOfKin: 'SHARON',
      kinPhone: '710673325',
    },
    {
      fileNo: 'NS009',
      name: 'BILLY HANI',
      age: 30,
      dob: new Date('1994-07-01'),
      email: 'BILLYBILLIMA@GMAIL.COM',
      phone: '705236968',
      occupation: 'ARTIST',
      drugAllergies: 'NOT AWARE',
      residence: 'ELDORET',
      nextOfKin: 'MATANA',
      kinPhone: '715847056',
    },
  ];

  for (const patientData of patients) {
    const password = await bcrypt.hash('patient123', 10);

    const user = await prisma.user.upsert({
      where: { email: patientData.email },
      update: {},
      create: {
        email: patientData.email,
        password,
        name: patientData.name,
        role: UserRole.PATIENT,
        isActive: true,
        userProfile: {
          create: {
            dateOfBirth: patientData.dob,
            allergies: patientData.drugAllergies !== 'NONE' && patientData.drugAllergies !== 'N/A' ? patientData.drugAllergies : undefined,
            emergencyContactName: patientData.nextOfKin,
            emergencyContactPhone: patientData.kinPhone,
          },
        },
      },
    });

    const patient = await prisma.patient.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
      },
    });

    console.log(`✅ Seeded ${patientData.fileNo}: ${patientData.name} - Patient ID: ${patient.id}`);
  }
}

async function seedDoctorSchedules() {
  console.log('\n📅 Creating Doctor Schedules...');

  const doctors = await prisma.doctor.findMany({
    include: { user: true },
  });

  for (const doctor of doctors) {
    const schedules = [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '16:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '12:00' },
    ];

    for (const schedule of schedules) {
      await prisma.doctorSchedule.upsert({
        where: {
          doctorId_dayOfWeek: {
            doctorId: doctor.id,
            dayOfWeek: schedule.dayOfWeek,
          },
        },
        update: {},
        create: {
          doctorId: doctor.id,
          dayOfWeek: schedule.dayOfWeek,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isAvailable: true,
        },
      });
    }

    console.log(`✅ Created schedule for ${doctor.user.name}`);
  }
}

async function seedAdminAndFrontdesk() {
  console.log('\n🔐 Seeding Admin and Frontdesk users...');

  // Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@nairobi-sculpt.com' },
    update: {},
    create: {
      email: 'admin@nairobi-sculpt.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      isActive: true,
      userProfile: {
        create: {
          department: 'Management',
        },
      },
    },
  });

  // Frontdesk
  const frontdeskPassword = await bcrypt.hash('frontdesk123', 10);
  await prisma.user.upsert({
    where: { email: 'frontdesk@nairobi-sculpt.com' },
    update: {},
    create: {
      email: 'frontdesk@nairobi-sculpt.com',
      password: frontdeskPassword,
      name: 'Sarah Johnson',
      role: UserRole.FRONTDESK,
      isActive: true,
      userProfile: {
        create: {
          department: 'Reception',
        },
      },
    },
  });

  console.log('✅ Admin and Frontdesk users created');
}

async function main() {
  try {
    console.log('🌱 Starting comprehensive database seed...\n');

    await seedAdminAndFrontdesk();
    await seedDoctors();
    await seedPatients();
    await seedDoctorSchedules();

    console.log('\n✨ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('✅ 1 Admin user created');
    console.log('✅ 1 Frontdesk user created');
    console.log('✅ 5 Master Doctors created with real profiles');
    console.log('✅ 9 Patients seeded from Excel spreadsheet');
    console.log('✅ Doctor schedules configured (Mon-Sat)');
    console.log('\n🔑 Demo Credentials:');
    console.log('Admin: admin@nairobi-sculpt.com / admin123');
    console.log('Frontdesk: frontdesk@nairobi-sculpt.com / frontdesk123');
    console.log('Doctor: dr.jpogalo@nairobi-sculpt.com / doctor123');
    console.log('Patient: millicent.wanjiku@email.com / patient123');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
