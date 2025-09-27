const gallery = [
  {
    id: 1,
    title: "Department Orientation Day",
    description: "Fresh students being welcomed during the department orientation program.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1551836022-4c4c79ecde51",
        description: "Students seated in the hall during orientation"
      },
      {
        url: "https://images.unsplash.com/photo-1558021212-51b6ecfa0db9",
        description: "Lecturer addressing fresh students"
      },
      {
        url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
        description: "Departmental executives with new students"
      }
    ],
    takenOn: "2023-10-12",
    category: "Event"
  },
  {
    id: 2,
    title: "Final Year Project Exhibition",
    description: "Students showcasing their innovative engineering projects during the exhibition.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1581090700227-4c4f50b3c6c1",
        description: "IoT project prototype on display"
      },
      {
        url: "https://images.unsplash.com/photo-1593642532400-2682810df593",
        description: "Visitors interacting with project teams"
      },
      {
        url: "https://images.unsplash.com/photo-1531685250784-7569952593d2",
        description: "Engineering students explaining their work"
      }
    ],
    takenOn: "2023-06-18",
    category: "Exhibition"
  },
  {
    id: 3,
    title: "Lecture in Progress",
    description: "Dr. Grace conducting a lecture on Artificial Intelligence in the main hall.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
        description: "Lecture hall filled with students"
      },
      {
        url: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
        description: "Slides projected during lecture"
      }
    ],
    takenOn: "2023-05-02",
    category: "Lecture"
  },
  {
    id: 4,
    title: "Laboratory Practical Session",
    description: "Students performing experiments in the electronics laboratory.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7",
        description: "Students working on electronic circuits"
      },
      {
        url: "https://images.unsplash.com/photo-1581090700227-4c4f50b3c6c1",
        description: "Close-up of circuit board prototype"
      }
    ],
    takenOn: "2022-11-22",
    category: "Lab Session"
  },
  {
    id: 5,
    title: "Guest Lecture Series",
    description: "An invited speaker delivering a lecture on renewable energy technologies.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        description: "Guest lecturer delivering his talk"
      },
      {
        url: "https://images.unsplash.com/photo-1503424886308-418b27e56362",
        description: "Students attentively listening"
      }
    ],
    takenOn: "2022-09-10",
    category: "Seminar"
  },
  {
    id: 6,
    title: "Departmental Cultural Day",
    description: "Students and staff celebrating cultural diversity with colorful attire.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1515165562835-c4c2b5a5f416",
        description: "Students in cultural attire"
      },
      {
        url: "https://images.unsplash.com/photo-1520975922071-a62c8a63f6a3",
        description: "Group performance on stage"
      }
    ],
    takenOn: "2022-07-30",
    category: "Event"
  },
  {
    id: 7,
    title: "Best Lecturer Award",
    description: "Head of Department presenting an award to the best lecturer of the year.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238",
        description: "Award ceremony moment"
      },
      {
        url: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
        description: "Lecturer holding certificate of recognition"
      }
    ],
    takenOn: "2022-05-15",
    category: "Award"
  },
  {
    id: 8,
    title: "Research Team Meeting",
    description: "Lecturers and students brainstorming during a research group meeting.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
        description: "Research group discussion"
      },
      {
        url: "https://images.unsplash.com/photo-1521791055366-0d553872125f",
        description: "Whiteboard notes from brainstorming session"
      }
    ],
    takenOn: "2021-12-04",
    category: "Meeting"
  },
  {
    id: 9,
    title: "Coding Bootcamp",
    description: "Students learning advanced JavaScript during a coding bootcamp session.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
        description: "Bootcamp session in progress"
      },
      {
        url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
        description: "Students practicing coding challenges"
      }
    ],
    takenOn: "2021-08-20",
    category: "Training"
  },
  {
    id: 10,
    title: "Departmental Sports Day",
    description: "Students participating in inter-departmental football competition.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf",
        description: "Team players warming up"
      },
      {
        url: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
        description: "Students cheering during match"
      }
    ],
    takenOn: "2021-04-17",
    category: "Sports"
  },
  {
    id: 11,
    title: "Robotics Workshop",
    description: "Hands-on training session where students built and programmed basic robots.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1581090464424-3e09f3b7a4c3",
        description: "Students assembling robotic parts"
      },
      {
        url: "https://images.unsplash.com/photo-1581092580345-d8c08c95a538",
        description: "Robot prototype being tested"
      }
    ],
    takenOn: "2021-03-10",
    category: "Workshop"
  },
  {
    id: 12,
    title: "Departmental Week",
    description: "Annual departmental week celebration with different academic and fun activities.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        description: "Students participating in quiz competition"
      },
      {
        url: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229",
        description: "Drama presentation during celebration"
      },
      {
        url: "https://images.unsplash.com/photo-1515169057865-5387ec356754",
        description: "Musical performance by departmental band"
      }
    ],
    takenOn: "2021-02-21",
    category: "Event"
  },
  {
    id: 13,
    title: "Career Talk",
    description: "Industry experts guiding students on career paths in engineering and technology.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
        description: "Guest speaker addressing students"
      },
      {
        url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
        description: "Students taking notes during career talk"
      }
    ],
    takenOn: "2020-11-18",
    category: "Seminar"
  },
  {
    id: 14,
    title: "Laboratory Upgrade",
    description: "Renovation of the electronics lab with new equipment and facilities.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
        description: "New lab benches and equipment"
      },
      {
        url: "https://images.unsplash.com/photo-1606761568499-6a6a62e7137c",
        description: "Students exploring the upgraded lab"
      }
    ],
    takenOn: "2020-09-05",
    category: "Lab Session"
  },
  {
    id: 15,
    title: "Innovation Challenge",
    description: "Competition among students to present innovative engineering solutions.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1531058020387-3be344556be6",
        description: "Students pitching their innovations"
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
        description: "Judges interacting with contestants"
      }
    ],
    takenOn: "2020-07-25",
    category: "Competition"
  },
  {
    id: 16,
    title: "Alumni Reunion",
    description: "Former students returning to share experiences with current students.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1551836022-29b0c1a1b1d7",
        description: "Group photo of alumni with staff"
      },
      {
        url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
        description: "Alumni sharing success stories"
      }
    ],
    takenOn: "2020-04-10",
    category: "Event"
  },
  {
    id: 17,
    title: "Science and Technology Fair",
    description: "Departmental participation in the institution-wide science fair.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1560448071-7c32a0c80d4d",
        description: "Student project display booth"
      },
      {
        url: "https://images.unsplash.com/photo-1518770660439-4636190af475",
        description: "Judges examining science fair projects"
      }
    ],
    takenOn: "2019-12-14",
    category: "Exhibition"
  },
  {
    id: 18,
    title: "Coding Hackathon",
    description: "Students solving real-world problems in a 24-hour coding competition.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df",
        description: "Teams collaborating during hackathon"
      },
      {
        url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df",
        description: "Night session of the hackathon"
      },
      {
        url: "https://images.unsplash.com/photo-1556741533-411cf82e4e2a",
        description: "Hackathon winners receiving award"
      }
    ],
    takenOn: "2019-10-20",
    category: "Competition"
  },
  {
    id: 19,
    title: "International Conference",
    description: "Department hosting an international conference on emerging technologies.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        description: "Keynote session with invited speakers"
      },
      {
        url: "https://images.unsplash.com/photo-1543269865-cbf427effbad",
        description: "Panel discussion during conference"
      }
    ],
    takenOn: "2019-07-09",
    category: "Conference"
  },
  {
    id: 20,
    title: "Departmental Staff Retreat",
    description: "Lecturers and staff participating in a retreat for bonding and strategy planning.",
    photos: [
      {
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
        description: "Outdoor team-building activities"
      },
      {
        url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
        description: "Staff members in group discussion"
      }
    ],
    takenOn: "2019-04-28",
    category: "Retreat"
  }
];

export default gallery;
