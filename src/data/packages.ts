import { HealthPackage } from '@/contexts/CartContext';

export const healthPackages: HealthPackage[] = [
  {
    id: '1',
    name: 'Basic Health Checkup',
    description: 'Essential health screening for early detection and prevention',
    price: 299,
    originalPrice: 399,
    duration: '2-3 hours',
    category: 'Basic',
    featured: true,
    image: '/api/placeholder/400/300',
    inclusions: [
      'Complete Blood Count (CBC)',
      'Blood Sugar (Fasting)',
      'Blood Pressure Check',
      'BMI Assessment',
      'Doctor Consultation',
      'Health Report within 24 hours'
    ]
  },
  {
    id: '2',
    name: 'Comprehensive Health Package',
    description: 'Complete health assessment with advanced diagnostics',
    price: 599,
    originalPrice: 799,
    duration: '4-5 hours',
    category: 'Comprehensive',
    featured: true,
    image: '/api/placeholder/400/300',
    inclusions: [
      'All Basic Package tests',
      'Lipid Profile',
      'Liver Function Tests',
      'Kidney Function Tests',
      'Thyroid Function Tests',
      'ECG',
      'Chest X-Ray',
      'Specialist Consultation',
      'Nutritionist Consultation'
    ]
  },
  {
    id: '3',
    name: 'Executive Health Checkup',
    description: 'Premium health package for busy professionals',
    price: 999,
    originalPrice: 1299,
    duration: '6-8 hours',
    category: 'Premium',
    featured: true,
    image: '/api/placeholder/400/300',
    inclusions: [
      'All Comprehensive Package tests',
      'MRI Brain Scan',
      'CT Chest Scan',
      'Stress Test',
      'Echo Cardiogram',
      'Tumor Markers',
      'Advanced Lipid Profile',
      'Vitamin D & B12',
      'Multiple Specialist Consultations',
      'Dedicated Health Manager'
    ]
  },
  {
    id: '4',
    name: 'Women\'s Health Package',
    description: 'Specialized health screening designed for women',
    price: 449,
    originalPrice: 599,
    duration: '3-4 hours',
    category: 'Specialized',
    image: '/api/placeholder/400/300',
    inclusions: [
      'Complete Blood Count',
      'Hormonal Assessment',
      'Thyroid Function Tests',
      'Iron Studies',
      'Pap Smear',
      'Mammography (for 40+)',
      'Bone Density Scan',
      'Gynecologist Consultation',
      'Nutritionist Consultation'
    ]
  },
  {
    id: '5',
    name: 'Men\'s Health Package',
    description: 'Comprehensive health screening for men\'s specific needs',
    price: 429,
    originalPrice: 579,
    duration: '3-4 hours',
    category: 'Specialized',
    image: '/api/placeholder/400/300',
    inclusions: [
      'Complete Blood Count',
      'Testosterone Levels',
      'Prostate Screening (PSA)',
      'Lipid Profile',
      'Liver Function Tests',
      'Cardiac Risk Assessment',
      'Lung Function Tests',
      'Urologist Consultation',
      'Fitness Assessment'
    ]
  },
  {
    id: '6',
    name: 'Senior Citizen Package',
    description: 'Specialized care for adults 60 years and above',
    price: 549,
    originalPrice: 699,
    duration: '4-5 hours',
    category: 'Specialized',
    image: '/api/placeholder/400/300',
    inclusions: [
      'Comprehensive Blood Panel',
      'Cardiac Assessment',
      'Bone Health Screening',
      'Cognitive Assessment',
      'Vision & Hearing Tests',
      'Diabetic Screening',
      'Cancer Screening',
      'Geriatrician Consultation',
      'Physiotherapy Assessment'
    ]
  },
  {
    id: '7',
    name: 'Diabetes Care Package',
    description: 'Specialized monitoring and management for diabetes',
    price: 349,
    originalPrice: 449,
    duration: '2-3 hours',
    category: 'Specialized',
    image: '/api/placeholder/400/300',
    inclusions: [
      'HbA1c Test',
      'Fasting & Post-meal Glucose',
      'Lipid Profile',
      'Kidney Function Tests',
      'Eye Examination',
      'Foot Assessment',
      'Blood Pressure Monitoring',
      'Endocrinologist Consultation',
      'Diabetic Educator Session'
    ]
  },
  {
    id: '8',
    name: 'Heart Health Package',
    description: 'Comprehensive cardiac assessment and screening',
    price: 699,
    originalPrice: 899,
    duration: '4-5 hours',
    category: 'Specialized',
    image: '/api/placeholder/400/300',
    inclusions: [
      'ECG & Echo Cardiogram',
      'Stress Test (TMT)',
      '2D Echo Color Doppler',
      'Lipid Profile Advanced',
      'Cardiac Enzymes',
      'Blood Pressure Monitoring',
      'Chest X-Ray',
      'Cardiologist Consultation',
      'Lifestyle Counseling'
    ]
  }
];

export const getPackageById = (id: string): HealthPackage | undefined => {
  return healthPackages.find(pkg => pkg.id === id);
};

export const getFeaturedPackages = (): HealthPackage[] => {
  return healthPackages.filter(pkg => pkg.featured);
};

export const getPackagesByCategory = (category: string): HealthPackage[] => {
  return healthPackages.filter(pkg => pkg.category === category);
};