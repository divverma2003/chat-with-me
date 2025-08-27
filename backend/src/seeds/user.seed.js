import { config } from "dotenv";
import { connectDB } from "../lib/db.js";
import User from "../models/user.model.js";

config();

const seedUsers = [
  // Female Users
  {
    email: "lily.evans@example.com",
    fullName: "Lily Evans",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/women/10.jpg",
  },
  {
    email: "grace.hughes@example.com",
    fullName: "Grace Hughes",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    email: "nora.matthews@example.com",
    fullName: "Nora Matthews",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    email: "ella.parker@example.com",
    fullName: "Ella Parker",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    email: "scarlett.brooks@example.com",
    fullName: "Scarlett Brooks",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    email: "zoe.foster@example.com",
    fullName: "Zoe Foster",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/women/15.jpg",
  },
  {
    email: "hannah.green@example.com",
    fullName: "Hannah Green",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    email: "stella.ward@example.com",
    fullName: "Stella Ward",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/women/17.jpg",
  },

  // Male Users
  {
    email: "ethan.cole@example.com",
    fullName: "Ethan Cole",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/men/10.jpg",
  },
  {
    email: "mason.hall@example.com",
    fullName: "Mason Hall",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    email: "logan.turner@example.com",
    fullName: "Logan Turner",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    email: "jackson.scott@example.com",
    fullName: "Jackson Scott",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    email: "leo.adams@example.com",
    fullName: "Leo Adams",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/men/14.jpg",
  },
  {
    email: "sebastian.king@example.com",
    fullName: "Sebastian King",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    email: "owen.bennett@example.com",
    fullName: "Owen Bennett",
    password: "test1234",
    profilePic: "https://randomuser.me/api/portraits/men/16.jpg",
  },
];

const seedUsersInDB = async () => {
  try {
    await connectDB();
    await User.insertMany(seedUsers);
    console.log("User seeding completed.");
  } catch (error) {
    console.error("Error seeding users:", error.message);
  }
};

seedUsersInDB().then(() => process.exit());
