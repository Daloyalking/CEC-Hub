const projects = [
  {
    id: 1,
    topic: "Smart Energy Meter Using IoT",
    details:
      "This project focused on building an Internet of Things (IoT)-based smart energy meter that enables real-time monitoring of power usage and automatic billing system.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1581090700227-4c4f50b3c6c1",
        description: "Prototype of IoT energy meter",
      },
      {
        url: "https://images.unsplash.com/photo-1593642532400-2682810df593",
        description: "System monitoring dashboard",
      },
    ],
    conductedBy: {
      name: "Dr. John Adewale",
      designation: "Senior Lecturer, Computer Engineering",
      image: "https://randomuser.me/api/portraits/men/34.jpg",
    },
    year: 2022,
  },
  {
    id: 2,
    topic: "AI-Based Traffic Light Control System",
    details:
      "This project applied machine learning techniques to optimize traffic light control in smart cities, reducing congestion and improving road safety.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
        description: "AI-powered traffic simulation",
      },
      {
        url: "https://images.unsplash.com/photo-1531685250784-7569952593d2",
        description: "Prototype model with sensors",
      },
    ],
    conductedBy: {
      name: "Prof. Grace Oladipo",
      designation: "Professor, Electrical Engineering",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    year: 2021,
  },
  {
    id: 3,
    topic: "Autonomous Drone for Agricultural Monitoring",
    details:
      "A drone-based solution designed to monitor crop health, detect pests, and optimize irrigation using computer vision and remote sensing.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
        description: "Drone monitoring crops",
      },
      {
        url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
        description: "Data visualization dashboard",
      },
    ],
    conductedBy: {
      name: "Dr. Peter Ibrahim",
      designation: "Lecturer, Computer Engineering",
      image: "https://randomuser.me/api/portraits/men/21.jpg",
    },
    year: 2023,
  },
  {
    id: 4,
    topic: "Blockchain-Based Voting System",
    details:
      "Developed a secure and transparent voting system using blockchain technology to prevent electoral fraud and ensure credibility.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1621418018370-4f32ecf2318c",
        description: "Voting interface",
      },
      {
        url: "https://images.unsplash.com/photo-1633356120850-04aa0df7a8da",
        description: "Blockchain ledger demonstration",
      },
    ],
    conductedBy: {
      name: "Dr. Aisha Lawal",
      designation: "Senior Lecturer, Information Systems",
      image: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    year: 2020,
  },
  {
    id: 5,
    topic: "Voice-Controlled Smart Home Assistant",
    details:
      "This project created a voice-enabled home automation system that allows users to control appliances and security features through speech recognition.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1581092334482-231c58cde3f4",
        description: "Voice assistant prototype",
      },
      {
        url: "https://images.unsplash.com/photo-1558002038-1055907df827",
        description: "Smart home system demo",
      },
    ],
    conductedBy: {
      name: "Prof. Samuel Okeke",
      designation: "Professor, Computer Engineering",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    year: 2022,
  },
  {
    id: 6,
    topic: "AI-Powered Health Diagnosis System",
    details:
      "A machine learning-based diagnostic system capable of predicting common diseases using patient data and medical history.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
        description: "Health diagnosis interface",
      },
      {
        url: "https://images.unsplash.com/photo-1580281657521-5e1e2bc39f57",
        description: "System analyzing patient data",
      },
    ],
    conductedBy: {
      name: "Dr. Mariam Yusuf",
      designation: "Senior Lecturer, Biomedical Engineering",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    year: 2023,
  },
  {
    id: 7,
    topic: "Renewable Energy Microgrid System",
    details:
      "Designed a decentralized microgrid integrating solar and wind energy to provide sustainable electricity in rural communities.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
        description: "Solar-powered microgrid",
      },
      {
        url: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9",
        description: "Wind energy integration",
      },
    ],
    conductedBy: {
      name: "Dr. Emmanuel Chukwu",
      designation: "Lecturer, Electrical Engineering",
      image: "https://randomuser.me/api/portraits/men/77.jpg",
    },
    year: 2021,
  },
  {
    id: 8,
    topic: "Cybersecurity Threat Detection System",
    details:
      "This project implemented an AI-based system to detect and respond to real-time cybersecurity threats.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1605902711622-cfb43c4437d7",
        description: "Threat detection dashboard",
      },
      {
        url: "https://images.unsplash.com/photo-1605902715553-d06452d2c6ed",
        description: "System in operation",
      },
    ],
    conductedBy: {
      name: "Dr. Fatimah Kareem",
      designation: "Lecturer, Cybersecurity",
      image: "https://randomuser.me/api/portraits/women/41.jpg",
    },
    year: 2022,
  },
  {
    id: 9,
    topic: "AI-Powered Sign Language Translator",
    details:
      "Created a computer vision system capable of translating sign language gestures into text and speech for better communication with the hearing impaired.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1581090468936-c7c39abefb0b",
        description: "Gesture recognition system",
      },
      {
        url: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980",
        description: "Sign language to text",
      },
    ],
    conductedBy: {
      name: "Prof. Henry Olayemi",
      designation: "Professor, Computer Engineering",
      image: "https://randomuser.me/api/portraits/men/39.jpg",
    },
    year: 2020,
  },
  {
    id: 10,
    topic: "Water Quality Monitoring System",
    details:
      "An IoT-based water monitoring solution designed to measure and report real-time water quality parameters such as pH, turbidity, and temperature.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
        description: "Water monitoring sensors",
      },
      {
        url: "https://images.unsplash.com/photo-1573497491208-6b1acb260507",
        description: "Mobile application dashboard",
      },
    ],
    conductedBy: {
      name: "Dr. Funke Babalola",
      designation: "Lecturer, Environmental Engineering",
      image: "https://randomuser.me/api/portraits/women/38.jpg",
    },
    year: 2023,
  },
  {
    id: 11,
    topic: "Facial Recognition Attendance System",
    details:
      "Developed a facial recognition-based attendance system that ensures accuracy, prevents proxy, and improves record-keeping in institutions.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1549924231-f129b911e442",
        description: "Facial recognition in progress",
      },
      {
        url: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
        description: "System dashboard",
      },
    ],
    conductedBy: {
      name: "Dr. Michael Adeniran",
      designation: "Lecturer, Computer Engineering",
      image: "https://randomuser.me/api/portraits/men/82.jpg",
    },
    year: 2022,
  },
  {
    id: 12,
    topic: "Smart Waste Management System",
    details:
      "Designed an IoT-based system that monitors waste levels in bins and optimizes collection routes to improve waste management efficiency.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1565372918674-b0f6b0f4a1e0",
        description: "Smart bin prototype",
      },
      {
        url: "https://images.unsplash.com/photo-1604328698692-7b6d9e71a62b",
        description: "Mobile tracking app",
      },
    ],
    conductedBy: {
      name: "Prof. Stella Ogundipe",
      designation: "Professor, Environmental Engineering",
      image: "https://randomuser.me/api/portraits/women/60.jpg",
    },
    year: 2021,
  },
  {
    id: 13,
    topic: "Biometric Security Door Lock",
    details:
      "A security system that uses fingerprint authentication to grant access, enhancing safety in residential and commercial areas.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1622661141541-9a1e01c3b8b7",
        description: "Biometric lock system",
      },
      {
        url: "https://images.unsplash.com/photo-1605902715490-df8b13e674c6",
        description: "Access control demo",
      },
    ],
    conductedBy: {
      name: "Dr. Ibrahim Musa",
      designation: "Senior Lecturer, Electrical Engineering",
      image: "https://randomuser.me/api/portraits/men/53.jpg",
    },
    year: 2020,
  },
  {
    id: 14,
    topic: "AI Chatbot for Student Support",
    details:
      "Built an artificial intelligence chatbot to assist students with academic inquiries, course registration, and timetable scheduling.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1611605698323-3c5b1d4a5a3d",
        description: "Chatbot conversation interface",
      },
      {
        url: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980",
        description: "Student interaction with chatbot",
      },
    ],
    conductedBy: {
      name: "Dr. Adaeze Nwosu",
      designation: "Lecturer, Information Technology",
      image: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    year: 2023,
  },
  {
    id: 15,
    topic: "E-Learning Platform with AR",
    details:
      "Developed an augmented reality (AR)-based e-learning platform to improve practical learning experiences for engineering students.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1581090700227-4c4f50b3c6c1",
        description: "Augmented reality in classroom",
      },
      {
        url: "https://images.unsplash.com/photo-1549924230-4f1b5b8b6b0f",
        description: "E-learning AR interface",
      },
    ],
    conductedBy: {
      name: "Prof. David Ojo",
      designation: "Professor, Educational Technology",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    year: 2022,
  },
  {
    id: 16,
    topic: "IoT-Based Fire Detection System",
    details:
      "An early warning fire detection system using IoT sensors to notify authorities and occupants via mobile alerts.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1605902715279-8c5f32d9c3d7",
        description: "Smoke detector prototype",
      },
      {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        description: "Mobile fire alert app",
      },
    ],
    conductedBy: {
      name: "Dr. Chinyere Umeh",
      designation: "Lecturer, Safety Engineering",
      image: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    year: 2021,
  },
  {
    id: 17,
    topic: "AI Music Composition System",
    details:
      "Created a system that uses artificial intelligence to compose original music pieces based on user input and preferences.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
        description: "Music composition software",
      },
      {
        url: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29",
        description: "System interface demo",
      },
    ],
    conductedBy: {
      name: "Dr. Olumide Bankole",
      designation: "Lecturer, Computer Science",
      image: "https://randomuser.me/api/portraits/men/16.jpg",
    },
    year: 2023,
  },
  {
    id: 18,
    topic: "Gesture-Controlled Robot",
    details:
      "Built a robot controlled by human gestures using accelerometer sensors and machine learning algorithms.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1593642532973-d31b6557fa68",
        description: "Gesture robot prototype",
      },
      {
        url: "https://images.unsplash.com/photo-1525182008055-f88b95ff7980",
        description: "Robot responding to gestures",
      },
    ],
    conductedBy: {
      name: "Prof. Joy Eze",
      designation: "Professor, Robotics Engineering",
      image: "https://randomuser.me/api/portraits/women/58.jpg",
    },
    year: 2022,
  },
  {
    id: 19,
    topic: "Smart Irrigation System",
    details:
      "Designed a sensor-based irrigation system that optimizes water usage and improves crop yield.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9",
        description: "IoT irrigation prototype",
      },
      {
        url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
        description: "Water flow sensors in farm",
      },
    ],
    conductedBy: {
      name: "Dr. Ahmed Suleiman",
      designation: "Lecturer, Agricultural Engineering",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    year: 2020,
  },
  {
    id: 20,
    topic: "AI-Powered Document Summarizer",
    details:
      "An NLP-based project that automatically summarizes lengthy documents into concise and meaningful text.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
        description: "Text summarizer system",
      },
      {
        url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
        description: "AI in action",
      },
    ],
    conductedBy: {
      name: "Dr. Esther Balogun",
      designation: "Senior Lecturer, Computer Science",
      image: "https://randomuser.me/api/portraits/women/74.jpg",
    },
    year: 2021,
  },
  {
    id: 21,
    topic: "Blockchain-Based Voting System",
    details:
      "A secure and transparent voting system leveraging blockchain technology to eliminate fraud and enhance trust in elections.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        description: "Blockchain voting interface",
      },
      {
        url: "https://images.unsplash.com/photo-1556741533-f6acd647d2fb",
        description: "Election security demo",
      },
    ],
    conductedBy: {
      name: "Dr. Musa Abdullahi",
      designation: "Lecturer, Computer Engineering",
      image: "https://randomuser.me/api/portraits/men/33.jpg",
    },
    year: 2023,
  },
  {
    id: 22,
    topic: "AI Health Diagnostic Tool",
    details:
      "An artificial intelligence system that analyzes medical images and patient data to assist in early disease detection.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1588776814546-ec07b5f1b79b",
        description: "AI medical image analysis",
      },
      {
        url: "https://images.unsplash.com/photo-1588776814072-5a7e9c5a7d28",
        description: "Health data visualization",
      },
    ],
    conductedBy: {
      name: "Prof. Amina Yusuf",
      designation: "Professor, Biomedical Engineering",
      image: "https://randomuser.me/api/portraits/women/78.jpg",
    },
    year: 2022,
  },
  {
    id: 23,
    topic: "Autonomous Drone Delivery System",
    details:
      "A drone delivery system designed to autonomously transport goods, reducing delivery time and cost.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1508614999368-9260051291ea",
        description: "Drone prototype in action",
      },
      {
        url: "https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2",
        description: "Autonomous navigation system",
      },
    ],
    conductedBy: {
      name: "Dr. Emeka Okonkwo",
      designation: "Senior Lecturer, Mechatronics Engineering",
      image: "https://randomuser.me/api/portraits/men/28.jpg",
    },
    year: 2021,
  },
  {
    id: 24,
    topic: "Virtual Reality Laboratory",
    details:
      "Developed a VR-based laboratory that allows students to conduct science experiments virtually with full immersion.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
        description: "VR headset for lab work",
      },
      {
        url: "https://images.unsplash.com/photo-1604014237744-35a1d3bdf0df",
        description: "Students testing VR lab",
      },
    ],
    conductedBy: {
      name: "Dr. Blessing Adeyemi",
      designation: "Lecturer, Computer Engineering",
      image: "https://randomuser.me/api/portraits/women/84.jpg",
    },
    year: 2022,
  },
  {
    id: 25,
    topic: "AI-Powered Sign Language Translator",
    details:
      "A system that translates sign language gestures into spoken or written words using machine learning and cameras.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1543269865-cbf427effbad",
        description: "Sign language recognition demo",
      },
      {
        url: "https://images.unsplash.com/photo-1581091012184-5c8f68f8c7c9",
        description: "AI translator interface",
      },
    ],
    conductedBy: {
      name: "Dr. Fatima Ibrahim",
      designation: "Lecturer, Computer Science",
      image: "https://randomuser.me/api/portraits/women/95.jpg",
    },
    year: 2023,
  },
  {
    id: 26,
    topic: "Renewable Energy Monitoring System",
    details:
      "A system that monitors solar and wind energy production, storing data in the cloud for analytics and optimization.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1509395176047-4a66953fd231",
        description: "Solar panel installation",
      },
      {
        url: "https://images.unsplash.com/photo-1581091012184-5c8f68f8c7c9",
        description: "Monitoring dashboard",
      },
    ],
    conductedBy: {
      name: "Prof. Richard Afolabi",
      designation: "Professor, Renewable Energy Engineering",
      image: "https://randomuser.me/api/portraits/men/61.jpg",
    },
    year: 2021,
  },
  {
    id: 27,
    topic: "AI Financial Fraud Detection System",
    details:
      "Machine learning-based project for detecting fraudulent financial transactions in banking systems.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1605902715530-3d60ff6ef3c7",
        description: "Bank transaction dashboard",
      },
      {
        url: "https://images.unsplash.com/photo-1588776814546-ec07b5f1b79b",
        description: "AI detecting anomalies",
      },
    ],
    conductedBy: {
      name: "Dr. Kingsley Uzo",
      designation: "Senior Lecturer, Software Engineering",
      image: "https://randomuser.me/api/portraits/men/46.jpg",
    },
    year: 2020,
  },
  {
    id: 28,
    topic: "IoT-Based Smart Parking System",
    details:
      "Created a parking system that detects available spaces and guides drivers via a mobile app.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1605902715294-68a5a981f836",
        description: "Smart parking sensors",
      },
      {
        url: "https://images.unsplash.com/photo-1517433456452-f9633a875f6f",
        description: "Parking guidance system",
      },
    ],
    conductedBy: {
      name: "Dr. Olabisi Fashola",
      designation: "Lecturer, Electrical Engineering",
      image: "https://randomuser.me/api/portraits/women/39.jpg",
    },
    year: 2022,
  },
  {
    id: 29,
    topic: "AI-Powered Crop Disease Detection",
    details:
      "An AI system that analyzes plant images to detect and classify crop diseases early, improving agricultural yield.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1524592094714-0f0654e20314",
        description: "Healthy vs diseased crops",
      },
      {
        url: "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9",
        description: "AI detection process",
      },
    ],
    conductedBy: {
      name: "Dr. Tunde Olaniyan",
      designation: "Lecturer, Agricultural Engineering",
      image: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    year: 2021,
  },
  {
    id: 30,
    topic: "AI Tutor for Personalized Learning",
    details:
      "Developed an AI tutor that adapts to individual students' learning pace, providing tailored exercises and feedback.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        description: "AI tutor interface",
      },
      {
        url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
        description: "Student using AI tutor",
      },
    ],
    conductedBy: {
      name: "Prof. Rose Nwachukwu",
      designation: "Professor, Educational Technology",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    year: 2023,
  },
];

export default projects;
