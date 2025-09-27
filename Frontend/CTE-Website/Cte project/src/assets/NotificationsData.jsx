const notification = [
  {
    id: 1,
    type: "event",
    title: "Department Seminar on AI",
    details:
      "A seminar on the applications of Artificial Intelligence in modern engineering.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        description: "Guest lecturer presenting AI applications.",
      },
      {
        url: "https://images.unsplash.com/photo-1504384308090-30ec1d1719a2",
        description: "Students attending the seminar.",
      },
    ],
    postedBy: {
      name: "Dr. John Doe",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    timestamp: "2025-09-15T10:30:00Z",
  },
  {
    id: 2,
    type: "reminder",
    title: "Reminder: Computer Networks Class",
    details:
      "All 300-level students are reminded that Computer Networks class will hold at 2 PM in Hall B.",
    level: "300",
    postedBy: {
      name: "Prof. Jane Smith",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    timestamp: "2025-09-16T08:00:00Z",
  },
  {
    id: 3,
    type: "material",
    title: "Lecture Material: Microprocessor Systems",
    details:
      "Lecture notes and slides for Microprocessor Systems have been uploaded.",
    level: "ND1",
    documents: [
      {
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        description: "Lecture slides in PDF",
      },
      {
        url: "https://file-examples.com/storage/fe7c6e7890e8f21b458a3a5/2017/02/file-sample_100kB.doc",
        description: "Lecture notes in DOC format",
      },
    ],
    postedBy: {
      name: "Dr. Ahmed Bello",
      image: "https://randomuser.me/api/portraits/men/76.jpg",
    },
    timestamp: "2025-09-18T09:45:00Z",
  },
  {
    id: 4,
    type: "announcement",
    title: "Department Sports Day",
    details:
      "The annual sports day will take place next month. All students are encouraged to participate.",
    postedBy: {
      name: "HOD - Engr. Grace Thomas",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    timestamp: "2025-09-12T14:00:00Z",
  },
  {
    id: 5,
    type: "event",
    title: "Coding Hackathon",
    details:
      "A 48-hour coding hackathon organized by the department in collaboration with tech companies.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df",
        description: "Teams coding during the hackathon.",
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
        description: "Judges evaluating project submissions.",
      },
    ],
    postedBy: {
      name: "Engr. Samuel Okafor",
      image: "https://randomuser.me/api/portraits/men/40.jpg",
    },
    timestamp: "2025-09-10T12:15:00Z",
  },
  {
    id: 6,
    type: "reminder",
    title: "Reminder: Digital Electronics Lab",
    details:
      "200-level students are reminded of their Digital Electronics Lab practical at 10 AM, Lab 2.",
    level: "200",
    postedBy: {
      name: "Dr. Florence Ojo",
      image: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    timestamp: "2025-09-17T07:00:00Z",
  },
  {
    id: 7,
    type: "material",
    title: "Assignment: Signal Processing",
    details:
      "Students should download and complete the attached assignment on Digital Signal Processing.",
    level: "ND2",
    documents: [
      {
        url: "https://file-examples.com/storage/fe7c6e7890e8f21b458a3a5/2017/02/file-sample_500kB.docx",
        description: "Assignment instructions",
      },
    ],
    postedBy: {
      name: "Dr. Peter Johnson",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    timestamp: "2025-09-14T16:20:00Z",
  },
  {
    id: 8,
    type: "announcement",
    title: "New Research Grants Available",
    details:
      "Faculty members are encouraged to apply for new TETFund research grants.",
    postedBy: {
      name: "Research Coordinator",
      image: "https://randomuser.me/api/portraits/women/29.jpg",
    },
    timestamp: "2025-09-11T11:45:00Z",
  },
  {
    id: 9,
    type: "event",
    title: "Alumni Meet 2025",
    details:
      "An opportunity to meet and network with our successful alumni in tech and engineering.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        description: "Alumni panel discussion.",
      },
      {
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
        description: "Students networking with alumni.",
      },
    ],
    postedBy: {
      name: "Engr. Joseph Musa",
      image: "https://randomuser.me/api/portraits/men/63.jpg",
    },
    timestamp: "2025-09-19T09:00:00Z",
  },
  {
    id: 10,
    type: "reminder",
    title: "Reminder: Project Proposal Submission",
    details:
      "Final year students must submit their project proposals by Friday, 5 PM.",
    level: "400",
    postedBy: {
      name: "Project Coordinator",
      image: "https://randomuser.me/api/portraits/women/71.jpg",
    },
    timestamp: "2025-09-20T06:00:00Z",
  },
  {
    id: 11,
    type: "material",
    title: "Lecture Material: Operating Systems",
    details: "Slides for Operating Systems Week 5 have been uploaded.",
    level: "HND1",
    documents: [
      {
        url: "https://file-examples.com/storage/fe7c6e7890e8f21b458a3a5/2017/10/file-sample_150kB.pdf",
        description: "Lecture slides PDF",
      },
    ],
    postedBy: {
      name: "Dr. Comfort Daniels",
      image: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    timestamp: "2025-09-08T13:40:00Z",
  },
  {
    id: 12,
    type: "announcement",
    title: "Library Orientation",
    details:
      "All fresh students must attend the mandatory library orientation this Thursday at 10 AM.",
    postedBy: {
      name: "Library Staff",
      image: "https://randomuser.me/api/portraits/men/14.jpg",
    },
    timestamp: "2025-09-06T09:00:00Z",
  },
  {
    id: 13,
    type: "event",
    title: "Robotics Workshop",
    details: "Hands-on robotics training workshop for all interested students.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9",
        description: "Students assembling robots.",
      },
    ],
    postedBy: {
      name: "Robotics Club Coordinator",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    timestamp: "2025-09-03T10:00:00Z",
  },
  {
    id: 14,
    type: "reminder",
    title: "Reminder: Mathematics Exam",
    details:
      "All 100-level students have their Mathematics exam tomorrow at 9 AM in Hall A.",
    level: "100",
    postedBy: {
      name: "Exam Officer",
      image: "https://randomuser.me/api/portraits/women/15.jpg",
    },
    timestamp: "2025-09-02T18:00:00Z",
  },
  {
    id: 15,
    type: "material",
    title: "Tutorial Notes: Database Systems",
    details: "Download the tutorial notes for Database Systems practice.",
    level: "HND2",
    documents: [
      {
        url: "https://file-examples.com/storage/fe7c6e7890e8f21b458a3a5/2017/02/file-sample_100kB.doc",
        description: "Tutorial Notes",
      },
    ],
    postedBy: {
      name: "Mr. Patrick Obi",
      image: "https://randomuser.me/api/portraits/men/19.jpg",
    },
    timestamp: "2025-09-01T15:30:00Z",
  },
  {
    id: 16,
    type: "announcement",
    title: "Power Outage Notice",
    details:
      "The department will experience a scheduled power outage on Friday from 12 PM - 3 PM.",
    postedBy: {
      name: "Department Admin",
      image: "https://randomuser.me/api/portraits/men/25.jpg",
    },
    timestamp: "2025-09-05T11:00:00Z",
  },
  {
    id: 17,
    type: "event",
    title: "Annual Tech Expo",
    details: "Showcase of final-year projects and departmental innovations.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504384308090-4ec1c1d88b7d",
        description: "Student presenting their project.",
      },
      {
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        description: "Audience viewing tech prototypes.",
      },
    ],
    postedBy: {
      name: "Engr. Philip Nnaji",
      image: "https://randomuser.me/api/portraits/men/77.jpg",
    },
    timestamp: "2025-09-07T09:30:00Z",
  },
  {
    id: 18,
    type: "reminder",
    title: "Reminder: Programming Quiz",
    details:
      "200-level students are reminded about their C++ programming quiz on Wednesday at 11 AM.",
    level: "200",
    postedBy: {
      name: "Dr. Elizabeth Brown",
      image: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    timestamp: "2025-09-04T07:15:00Z",
  },
  {
    id: 19,
    type: "material",
    title: "E-Book: Advanced Java",
    details:
      "Reference e-book for Java programming course has been uploaded.",
    level: "ND1",
    documents: [
      {
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        description: "Advanced Java PDF book",
      },
    ],
    postedBy: {
      name: "Prof. Adewale Ogun",
      image: "https://randomuser.me/api/portraits/men/85.jpg",
    },
    timestamp: "2025-09-09T14:25:00Z",
  },
  {
    id: 20,
    type: "announcement",
    title: "Faculty Meeting",
    details:
      "All lecturers must attend the emergency faculty meeting scheduled for Monday at 2 PM.",
    postedBy: {
      name: "Dean of Faculty",
      image: "https://randomuser.me/api/portraits/men/91.jpg",
    },
    timestamp: "2025-09-10T08:45:00Z",
  },
  {
    id: 21,
    type: "event",
    title: "Career Fair",
    details:
      "Companies from various industries will be present to recruit interns and graduates.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556761175-4b46a572b786",
        description: "Students interacting with recruiters.",
      },
      {
        url: "https://images.unsplash.com/photo-1556761175-5973d8a1c7d0",
        description: "Company booths at the fair.",
      },
    ],
    postedBy: {
      name: "Career Services",
      image: "https://randomuser.me/api/portraits/women/66.jpg",
    },
    timestamp: "2025-09-13T13:15:00Z",
  },
  {
    id: 22,
    type: "reminder",
    title: "Reminder: Seminar Report Submission",
    details:
      "All postgraduate students must submit their seminar reports by 12 noon tomorrow.",
    level: "Postgraduate",
    postedBy: {
      name: "PG Coordinator",
      image: "https://randomuser.me/api/portraits/men/36.jpg",
    },
    timestamp: "2025-09-14T07:40:00Z",
  },
  {
    id: 23,
    type: "material",
    title: "Lab Manual: Electronics",
    details:
      "Updated Electronics Lab manual has been uploaded for all 200-level students.",
    level: "ND2",
    documents: [
      {
        url: "https://file-examples.com/storage/fe7c6e7890e8f21b458a3a5/2017/10/file-example_PDF_1MB.pdf",
        description: "Lab Manual PDF",
      },
    ],
    postedBy: {
      name: "Lab Coordinator",
      image: "https://randomuser.me/api/portraits/women/81.jpg",
    },
    timestamp: "2025-09-02T15:50:00Z",
  },
  {
    id: 24,
    type: "announcement",
    title: "Public Holiday",
    details:
      "The Federal Government has declared Monday as a public holiday. No lectures will hold.",
    postedBy: {
      name: "Registrar",
      image: "https://randomuser.me/api/portraits/men/72.jpg",
    },
    timestamp: "2025-09-01T08:00:00Z",
  },
  {
    id: 25,
    type: "event",
    title: "Innovation Challenge",
    details:
      "Students are invited to participate in the departmental innovation challenge.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1581092334612-1e7e6c8c5e9d",
        description: "Prototype presentation.",
      },
      {
        url: "https://images.unsplash.com/photo-1573164574230-4de9f8c48f3e",
        description: "Judges evaluating innovations.",
      },
    ],
    postedBy: {
      name: "Innovation Hub",
      image: "https://randomuser.me/api/portraits/men/59.jpg",
    },
    timestamp: "2025-09-06T14:30:00Z",
  },
  {
    id: 26,
    type: "reminder",
    title: "Reminder: Group Presentation",
    details:
      "Group 3 should be ready to present their project in Software Engineering tomorrow at 1 PM.",
    level: "400",
    postedBy: {
      name: "Dr. Mercy Chukwu",
      image: "https://randomuser.me/api/portraits/women/38.jpg",
    },
    timestamp: "2025-09-08T17:20:00Z",
  },
  {
    id: 27,
    type: "material",
    title: "Slides: Data Structures",
    details: "Lecture slides for Data Structures have been uploaded.",
    level: "HND1",
    documents: [
      {
        url: "https://file-examples.com/storage/fe7c6e7890e8f21b458a3a5/2017/10/file-example_PPT_1MB.ppt",
        description: "Lecture Slides PPT",
      },
    ],
    postedBy: {
      name: "Dr. Benson Afolabi",
      image: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    timestamp: "2025-09-03T10:00:00Z",
  },
  {
    id: 28,
    type: "announcement",
    title: "Departmental Cleanup",
    details:
      "Students are requested to participate in the departmental cleanup exercise this Saturday at 8 AM.",
    postedBy: {
      name: "Student Union Rep",
      image: "https://randomuser.me/api/portraits/women/54.jpg",
    },
    timestamp: "2025-09-05T12:10:00Z",
  },
  {
    id: 29,
    type: "event",
    title: "Entrepreneurship Talk",
    details:
      "Successful alumni entrepreneurs will share their experiences in business and startups.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1504384308090-21fdb6e1f32b",
        description: "Entrepreneur giving a talk.",
      },
    ],
    postedBy: {
      name: "Entrepreneurship Center",
      image: "https://randomuser.me/api/portraits/men/64.jpg",
    },
    timestamp: "2025-09-07T09:00:00Z",
  },
  {
    id: 30,
    type: "reminder",
    title: "Reminder: Mid-Semester Break",
    details:
      "Mid-semester break begins next week Monday. Students should complete all pending assignments.",
    level: "All",
    postedBy: {
      name: "Exams & Records",
      image: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    timestamp: "2025-09-09T06:30:00Z",
  },
];

export default notification;
