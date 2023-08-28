import Img1 from "../assets/images/img1.png";
import Img2 from "../assets/images/img2.png";
import Img3 from "../assets/images/img3.png";
import Sample from "../assets/audios/sample.mp3";

export const SeedMessages = [
  { id: 1, owner: false, message: "Hi!", images: [], audio: null },
  {
    id: 2,
    owner: true,
    message: "Hi! How are you doing?",
    images: [],
    audio: null,
  },
  { id: 3, owner: false, message: "Yeah i am fine", images: [], audio: null },
  {
    id: 4,
    owner: true,
    message: "some images",
    images: [Img1, Img2, Img3],
    audio: null,
  },
  { id: 5, owner: false, message: "Cool!", images: [], audio: null },
  {
    id: 6,
    owner: true,
    message: "testing audio file",
    images: [],
    audio: Sample,
  },
  { id: 7, owner: false, message: "Nice!", images: [], audio: null },
  { id: 8, owner: true, message: "See you", images: [], audio: null },
  {
    id: 9,
    owner: false,
    message: "some images",
    images: [Img1, Img2, Img3],
    audio: null,
  },
];
