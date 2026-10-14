/**
 * ANVAYA 2026 — central event configuration.
 * Every date, name, venue and link shown on the site is read from here.
 * Loaded as a classic script so the site also works when opened via file://.
 */
(function (root) {
  'use strict';

  const CONFIG = {
    brand: {
      name: 'ANVAYA',
      year: '2026',
      fullName: 'ANVAYA 2026',
      tagline: 'Bonds Beyond Beginnings',
      closingLine: 'Every beginning becomes a story.',
      department: 'CSE 2',
      departmentFullName: 'Department of Computer Science & Engineering — CSE 2',
      institution: 'Mahatma Gandhi Institute of Technology',
      institutionShort: 'MGIT',
      meaning: 'In Sanskrit, anvaya is the thread of connection — what joins one thing to the next.'
    },

    datetime: {
      weekday: 'Thursday',
      fullDateString: 'Thursday, 15 October 2026',
      shortDate: '15 Oct 2026',
      time: '9:30 AM',
      timezone: 'IST',
      venue: 'E-201',
      venueLocation: 'MGIT Campus — E Block',
      startTimestamp: '2026-10-15T09:30:00+05:30',
      endTimestamp: '2026-10-15T12:30:00+05:30'
    },

    welcome: {
      badge: 'A heartfelt welcome from the seniors',
      title: 'The OGs of CSE 2 bring you a celebration to remember.',
      lead: 'One department. Two batches. Countless memories waiting to be made.',
      body: 'CSE 2 invites its newest members to begin their MGIT journey with a day filled with energy, laughter, and unforgettable moments.',
      letterHeading: 'Welcome to MGIT. Your next chapter starts here.',
      letterBody: "To our wonderful freshers: welcome to a journey of discovery, friendship, challenges, and growth. May you find your people, discover what you're capable of, and turn every opportunity into a step towards something extraordinary. Here's to new beginnings and the memories we'll create together."
    },

    schedule: [
      {
        id: 'sched-1', number: '01',
        start: '2026-10-15T09:30:00+05:30', end: '2026-10-15T09:50:00+05:30',
        time: '09:30 – 09:50 AM', shortTime: '09:30',
        title: 'Welcoming Guests & Inauguration',
        description: 'The grand ceremonial commencement of ANVAYA 2026. Traditional floral reception, lighting of the lamp, and inaugural address.'
      },
      {
        id: 'sched-2', number: '02',
        start: '2026-10-15T09:50:00+05:30', end: '2026-10-15T10:20:00+05:30',
        time: '09:50 – 10:20 AM', shortTime: '09:50',
        title: 'Speeches & Inspiring Words',
        description: 'Inspiring words of wisdom, encouragement, and stories from our respected Principal, HOD, Dr. Meera Alphy, Dr. Madhubabu, and senior mentors.'
      },
      {
        id: 'sched-3', number: '03',
        start: '2026-10-15T10:20:00+05:30', end: '2026-10-15T10:30:00+05:30',
        time: '10:20 – 10:30 AM', shortTime: '10:20',
        title: 'Dance Performance — Act I',
        description: 'Electrifying choreography, high-octane stage beats, and synchronized rhythm kicking off the cultural showcase.'
      },
      {
        id: 'sched-4', number: '04',
        start: '2026-10-15T10:30:00+05:30', end: '2026-10-15T10:50:00+05:30',
        time: '10:30 – 10:50 AM', shortTime: '10:30',
        title: 'Singing & Musical Showcase',
        description: "Soulful acoustic melodies, crowd anthems, and breathtaking musical performances to elevate the room's energy."
      },
      {
        id: 'sched-5', number: '05',
        start: '2026-10-15T10:50:00+05:30', end: '2026-10-15T11:10:00+05:30',
        time: '10:50 – 11:10 AM', shortTime: '10:50',
        title: 'Dance Performance — Act II',
        description: 'Second thrilling wave of stage dance showcases featuring energetic fusion beats and showstopping group acts.'
      },
      {
        id: 'sched-6', number: '06',
        start: '2026-10-15T11:10:00+05:30', end: '2026-10-15T12:00:00+05:30',
        time: '11:10 AM – 12:00 PM', shortTime: '11:10',
        title: 'Rose Ceremony',
        description: 'A cherished tradition welcoming every fresher with flowers, warm smiles, introductions, and everlasting bonds.'
      },
      {
        id: 'sched-7', number: '07',
        start: '2026-10-15T12:00:00+05:30', end: '2026-10-15T12:30:00+05:30',
        time: '12:00 – 12:30 PM', shortTime: '12:00',
        title: 'Everyone Dancing — DJ Jamming',
        description: 'The grand finale! The floor opens up for every senior and fresher to dance together to high-energy DJ beats and celebration.'
      }
    ],

    // Chapter 02 groups the real schedule into destinations. No new events are introduced here —
    // each destination simply points at one or more schedule entries above.
    destinations: [
      { id: 'dest-inauguration', title: 'The Inauguration', kicker: 'Ceremony', glyph: 'lamp', scheduleIds: ['sched-1'],
        summary: 'Floral reception, the lighting of the lamp and the inaugural address.' },
      { id: 'dest-words', title: 'Words of Wisdom', kicker: 'Speeches', glyph: 'voice', scheduleIds: ['sched-2'],
        summary: 'The Principal, the HOD, faculty and senior mentors speak to the new batch.' },
      { id: 'dest-dance', title: 'Dance', kicker: 'Performances · Two acts', glyph: 'dance', scheduleIds: ['sched-3', 'sched-5'],
        summary: 'Two stage acts — choreography to open the showcase, fusion group acts to return.' },
      { id: 'dest-music', title: 'Music', kicker: 'Performance', glyph: 'music', scheduleIds: ['sched-4'],
        summary: 'Acoustic melodies, crowd anthems and live singing.' },
      { id: 'dest-rose', title: 'Rose Ceremony', kicker: 'Special moment', glyph: 'rose', scheduleIds: ['sched-6'],
        summary: 'Every fresher is welcomed with flowers, introductions and warm smiles.' },
      { id: 'dest-celebration', title: 'The Celebration', kicker: 'Finale', glyph: 'stars', scheduleIds: ['sched-7'],
        summary: 'The floor opens to everyone — seniors and freshers dancing together to DJ beats.' }
    ],

    faculty: [
      { id: 'fac-1', name: 'Prof. G. ChandraMohan Reddy', role: 'Principal', honorific: 'Respected Principal',
        department: 'Mahatma Gandhi Institute of Technology', initials: 'GCR', image: 'images/people/chandramohan-reddy.jpg' },
      { id: 'fac-2', name: 'Prof. T. V. Rajini Kanth', role: 'Head of Department', honorific: 'Honourable HOD',
        department: 'Department of Computer Science & Engineering', initials: 'TVR', image: 'images/people/rajini-kanth.jpg' },
      { id: 'fac-3', name: 'Dr. Meera Alphy', role: 'Faculty In-charge, CSE 2', honorific: 'Beloved Faculty In-charge',
        department: 'Department of Computer Science & Engineering — CSE 2', initials: 'MA', image: 'images/people/meera-alphy.jpg' },
      { id: 'fac-4', name: 'Dr. Madhubabu', role: 'Assistant Professor', honorific: 'Assistant Professor',
        department: 'Department of Computer Science & Engineering', initials: 'MB', image: 'images/people/madhubabu.jpg' }
    ],

    // Student organising committee. These entries were never shown on the previous site and could not
    // be verified, so they stay hidden until someone confirms them and sets `coordinatorsVerified: true`.
    coordinatorsVerified: false,
    coordinators: [
      { id: 'c-1', name: 'R. Siddharth Varma', role: 'President / Lead' },
      { id: 'c-2', name: 'K. Shreya Reddy', role: 'Vice President' },
      { id: 'c-3', name: 'M. Harsha Vardhan', role: 'Technical Head' },
      { id: 'c-4', name: 'P. Ananya Rao', role: 'Cultural Head' },
      { id: 'c-5', name: 'V. Sai Karthik', role: 'Event Logistics' },
      { id: 'c-6', name: 'B. Nikhitha', role: 'Hospitality Lead' },
      { id: 'c-7', name: 'T. Aditya Sharma', role: 'Creative & Media' },
      { id: 'c-8', name: 'S. Divya Sree', role: 'Stage & Anchoring' },
      { id: 'c-9', name: 'K. Akhil Teja', role: 'Design Head' },
      { id: 'c-10', name: 'N. Tanmayi', role: 'Sponsorship & Gifts' },
      { id: 'c-11', name: 'G. Charan Kumar', role: 'Sound & DJ Lead' },
      { id: 'c-12', name: 'Ch. Pooja Reddy', role: 'PR & Communications' }
    ],

    // Past-event photographs for Chapter 05. Add entries like
    //   { src: 'images/memories/2025-rose-ceremony.jpg', alt: 'Seniors handing roses to freshers', caption: 'Rose Ceremony · 2025' }
    // and the midnight-lake gallery appears automatically. Empty = the intentional "still lake" state.
    memories: [],

    links: {
      instagramUrl: 'https://instagram.com/anvaya_mgit',
      instagramHandle: '@anvaya_mgit',
      driveGalleryUrl: 'https://drive.google.com/drive/folders/113pdQ3sQI-rSpyySxFSQzCH5jfqVXxw7',
      footerCredit: 'Made by CSE 2 with fondness'
    },

    assets: {
      artwork: 'images/poster.jpeg',
      artworkSmall: 'images/brand/artwork-800.webp',
      wordmark: 'images/brand/wordmark-key.webp',
      wordmarkSmall: 'images/brand/wordmark-key-sm.webp',
      // The printed invitation sent to our guests of honour (shown in Chapter 04 once the file exists).
      guestInvitation: 'images/invitation-letter.jpg'
    }
  };

  root.ANVAYA = root.ANVAYA || {};
  root.ANVAYA.config = CONFIG;
})(window);
