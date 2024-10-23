
import { BsBarChartFill } from "react-icons/bs";
import { FaPray } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { FaBookOpen } from "react-icons/fa";
import { MdPrivacyTip } from "react-icons/md";

export const features = [
  {
    heading: "Answers to your spiritual questions in seconds.",
    description:
      "Guided delivers relevant Bible verses and interpretations instantly, helping you find clarity and guidance without delay.",
    icon: <IoChatboxEllipsesSharp  className="text-primary h-4 w-4 relative z-50" />,
  },
  {
    heading: "Tailored advice that speaks to your faith journey.",
    description:
      "Receive responses crafted to your specific queries and spiritual needs, ensuring that the guidance you get is meaningful and relevant.",
    icon: <FaPray className="text-primary h-4 w-4 relative z-50" />,
  },
  {
    heading: "24/7 Availability - Faithful support, any time of day or night.",
    description:
      "No matter when inspiration strikes or questions arise, Guided Gospel is here to provide support and wisdom whenever you need it.",
    icon: <BsBarChartFill className="text-primary h-4 w-4 relative z-50" />,
  },
  {
    heading: "Engage with Scripture like never before.",
    description:
      "Explore Bible stories and teachings interactively, making learning about faith engaging and accessible through dynamic conversations.",
    icon: <FaBookOpen  className="text-primary h-4 w-4 relative z-50" />,
  },
  {
    heading: "Start each day with a dose of spiritual encouragement.",
    description:
    "Receive daily Bible verses and uplifting messages to inspire and motivate you as you go about your day, helping to keep your faith strong.",
    icon: <IoMdSunny  className="text-primary h-4 w-4 relative z-50" />,
  },
  {
    heading: "Your Privacy, Our Promise.",
    description:
      "At Guided Gospel, your journey is private and secure. We don’t sell your data, ensuring your spiritual exploration remains confidential.",
    icon: <MdPrivacyTip  className="text-primary h-4 w-4 relative z-50" />,
  },
];
