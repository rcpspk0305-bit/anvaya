/**
 * ANVAYA 2K26 - Central Event Configuration
 * Replicating and elevating the Avyra experience for CSE 2 at MGIT.
 */
export const EVENT_CONFIG = {
  // 1. Event Identity & College
  brand: {
    name: "ANVAYA",
    edition: "2K26",
    fullName: "ANVAYA 2K26",
    department: "CSE 2",
    departmentFullName: "Department of Computer Science & Engineering - CSE 2",
    institution: "Mahatma Gandhi Institute of Technology (MGIT)",
    institutionShort: "MGIT",
    tagline: "Where It All Begins.",
    subTagline: "“Some beginnings deserve to be experienced.”",
    batchInfo: "Class of CSE 2 • Batch of 2026",
    batchYear: "2026",
    experienceLabel: "AN EXPERIENCE BY CSE 2",
    airspaceLabel: "FLIGHT ANVAYA • CSE 2"
  },

  // 2. Date, Time & Venue
  datetime: {
    date: "15/10/2026",
    weekday: "Thursday",
    fullDateString: "Thursday, 15 October 2026",
    time: "9:30 AM",
    timeSuffix: "Onwards",
    venue: "E-201",
    venueLocation: "MGIT Campus - E Block",
    targetTimestamp: "2026-10-15T09:30:00+05:30",
    timezone: "IST"
  },

  // 3. Welcome / Senior Message
  welcome: {
    sectionBadge: "A Heartfelt Welcome From Seniors",
    title: "The OGs of CSE 2 bring you a celebration to remember.",
    highlightLead: "One department. Two batches. Countless memories waiting to be made.",
    messageBody: "CSE 2 invites its newest members to begin their MGIT journey with a day filled with energy, laughter, and unforgettable moments.",
    letterHeading: "Welcome to MGIT. Your next chapter starts here.",
    letterBody: "To our wonderful freshers: welcome to a journey of discovery, friendship, challenges, and growth. May you find your people, discover what you're capable of, and turn every opportunity into a step towards something extraordinary. Here's to new beginnings and the memories we'll create together."
  },

  // 4. Custom Schedule & Timeline
  schedule: [
    {
      id: "sched-1",
      number: "01",
      time: "09:30 AM - 09:50 AM",
      shortTime: "09:30 AM",
      title: "Welcoming Guests & Inauguration",
      description: "The grand ceremonial commencement of ANVAYA 2K26. Traditional floral reception, lighting of the lamp, and inaugural address.",
      icon: "sparkles",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-2",
      number: "02",
      time: "09:50 AM - 10:20 AM",
      shortTime: "09:50 AM",
      title: "Speeches & Inspiring Words",
      description: "Inspiring words of wisdom, encouragement, and stories from our respected Principal, HOD, Dr. Meera Alphy, Dr. Madhubabu, and senior mentors.",
      icon: "mic",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-3",
      number: "03",
      time: "10:20 AM - 10:30 AM",
      shortTime: "10:20 AM",
      title: "Dance Performance (Act I)",
      description: "Electrifying choreography, high-octane stage beats, and synchronized rhythm kicking off the cultural showcase.",
      icon: "disc",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-4",
      number: "04",
      time: "10:30 AM - 10:50 AM",
      shortTime: "10:30 AM",
      title: "Singing & Musical Showcase",
      description: "Soulful acoustic melodies, crowd anthems, and breathtaking musical performances to elevate the room's energy.",
      icon: "music",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-5",
      number: "05",
      time: "10:50 AM - 11:10 AM",
      shortTime: "10:50 AM",
      title: "Dance Performance (Act II)",
      description: "Second thrilling wave of stage dance showcases featuring energetic fusion beats and showstopping group acts.",
      icon: "disc",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-6",
      number: "06",
      time: "11:10 AM - 12:00 PM",
      shortTime: "11:10 AM",
      title: "Rose Ceremony",
      description: "A cherished tradition welcoming every fresher with flowers, warm smiles, introductions, and everlasting bonds.",
      icon: "heart",
      venueBadge: "Venue: E-201 • MGIT"
    },
    {
      id: "sched-7",
      number: "07",
      time: "12:00 PM - 12:30 PM",
      shortTime: "12:00 PM",
      title: "Everyone Dancing (DJ Jamming)",
      description: "The grand finale! The floor opens up for every senior and fresher to dance together to high-energy DJ beats and celebration.",
      icon: "party",
      venueBadge: "Venue: E-201 • MGIT"
    }
  ],

  // 5. Faculty & Leadership (Guests of Honor)
  faculty: [
    {
      id: "fac-1",
      name: "Prof. G. ChandraMohan Reddy",
      role: "Respected Principal",
      department: "Mahatma Gandhi Institute of Technology (MGIT)",
      badge: "MGIT Leadership",
      avatarInitials: "GCR",
      image: "images/chandramohan-reddy.jpg"
    },
    {
      id: "fac-2",
      name: "Prof. T. V. Rajini Kanth",
      role: "Honourable HOD",
      department: "Department of Computer Science & Engineering",
      badge: "MGIT Leadership",
      avatarInitials: "TRK",
      image: "images/rajini-kanth.jpg"
    },
    {
      id: "fac-3",
      name: "Dr. Meera Alphy",
      role: "Beloved Faculty Incharge",
      department: "Department of Computer Science & Engineering - CSE 2",
      badge: "CSE 2 Incharge",
      avatarInitials: "DMA",
      image: "images/meera.jpg"
    },
    {
      id: "fac-4",
      name: "Dr. Madhubabu",
      role: "Assistant Professor",
      department: "Department of Computer Science & Engineering",
      badge: "CSE 2 Faculty",
      avatarInitials: "DMB",
      image: ""
    }
  ],

  // 6. Student Coordinators (CSE 2 Organizing Committee)
  coordinators: [
    { id: "c-1", name: "R. Siddharth Varma", role: "President / Lead", initials: "SV" },
    { id: "c-2", name: "K. Shreya Reddy", role: "Vice President", initials: "SR" },
    { id: "c-3", name: "M. Harsha Vardhan", role: "Technical Head", initials: "HV" },
    { id: "c-4", name: "P. Ananya Rao", role: "Cultural Head", initials: "AR" },
    { id: "c-5", name: "V. Sai Karthik", role: "Event Logistics", initials: "SK" },
    { id: "c-6", name: "B. Nikhitha", role: "Hospitality Lead", initials: "BN" },
    { id: "c-7", name: "T. Aditya Sharma", role: "Creative & Media", initials: "AS" },
    { id: "c-8", name: "S. Divya Sree", role: "Stage & Anchoring", initials: "DS" },
    { id: "c-9", name: "K. Akhil Teja", role: "Design Head", initials: "AT" },
    { id: "c-10", name: "N. Tanmayi", role: "Sponsorship & Gifts", initials: "NT" },
    { id: "c-11", name: "G. Charan Kumar", role: "Sound & DJ Lead", initials: "CK" },
    { id: "c-12", name: "Ch. Pooja Reddy", role: "PR & Communications", initials: "PR" }
  ],

  // 7. Links & Social Media
  links: {
    instagramUrl: "https://instagram.com/anvaya_mgit",
    instagramHandle: "@anvaya_mgit",
    driveGalleryUrl: "https://drive.google.com/drive/folders/113pdQ3sQI-rSpyySxFSQzCH5jfqVXxw7",
    footerCredit: "Made by CSE-2 with fondness"
  }
};
