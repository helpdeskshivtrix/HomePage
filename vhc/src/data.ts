import type { Job, Project, Service } from './types'

export const services: Service[] = [
 { id:'s1', title:'Rakesh Electrical Works', category:'Electrician', location:'Durgapur, West Bengal', price:'From ₹299', rating:'4.8', description:'Home wiring, fan and light installation, switchboard repair.', initials:'RE', verified:true },
 { id:'s2', title:'CoolCare AC Service', category:'AC Repair', location:'Asansol, West Bengal', price:'From ₹499', rating:'4.7', description:'AC servicing, gas check, installation and seasonal maintenance.', initials:'CC', verified:true },
 { id:'s3', title:'Asha Home Cleaning', category:'Cleaning', location:'Kolkata, West Bengal', price:'Get a quote', rating:'4.9', description:'Kitchen, bathroom and full-home cleaning appointments.', initials:'AH', verified:false },
 { id:'s4', title:'Suman Computer Care', category:'Computer Repair', location:'Durgapur, West Bengal', price:'From ₹199', rating:'4.8', description:'Laptop repair, Windows support, Wi-Fi and CCTV setup.', initials:'SC', verified:true },
 { id:'s5', title:'Mitra Plumbing Services', category:'Plumber', location:'Burdwan, West Bengal', price:'From ₹249', rating:'4.6', description:'Leak repair, bathroom fittings, taps and water lines.', initials:'MP', verified:false },
 { id:'s6', title:'BrightPath Tutors', category:'Tutor', location:'Kolkata, West Bengal', price:'From ₹350/hr', rating:'4.9', description:'School tuition, maths and science coaching for students.', initials:'BT', verified:true }
]
export const jobs: Job[] = [
 { id:'j1', title:'IT Support Executive', company:'Eastern Digital Services', location:'Durgapur, West Bengal', salary:'₹18,000–₹25,000/mo', type:'Full-time', posted:'2 days ago', tags:['IT Support','Windows','Networking'] },
 { id:'j2', title:'Customer Support Associate', company:'ConnectNow Services', location:'Kolkata, West Bengal', salary:'₹15,000–₹22,000/mo', type:'Full-time', posted:'1 day ago', tags:['Communication','Customer Service'] },
 { id:'j3', title:'Frontend Developer', company:'RemoteWorks India', location:'Remote · India', salary:'₹4–7 LPA', type:'Remote', posted:'3 days ago', tags:['React','TypeScript','CSS'] },
 { id:'j4', title:'AC Technician', company:'CoolCare Facilities', location:'Asansol, West Bengal', salary:'₹16,000–₹24,000/mo', type:'Contract', posted:'5 days ago', tags:['HVAC','Field Service'] },
 { id:'j5', title:'Data Entry Operator', company:'Bengal Office Solutions', location:'Burdwan, West Bengal', salary:'₹10,000–₹14,000/mo', type:'Part-time', posted:'Today', tags:['Typing','Excel'] }
]
export const projects: Project[] = [
 { id:'p1', title:'Build a small business website', client:'Local retail business', budget:'₹8,000–₹15,000', timeline:'2–3 weeks', category:'Web Development', description:'Responsive 5-page website with contact form and basic SEO.' },
 { id:'p2', title:'Design social media creatives', client:'Growing food brand', budget:'₹2,000–₹5,000', timeline:'1 week', category:'Graphic Design', description:'A set of 10 social media creatives with editable source files.' },
 { id:'p3', title:'Set up office Wi-Fi and CCTV', client:'Small office', budget:'₹5,000–₹12,000', timeline:'3–5 days', category:'IT & Networking', description:'Plan and configure reliable Wi-Fi coverage and camera access.' }
]
