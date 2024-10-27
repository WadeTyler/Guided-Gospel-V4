import { Link } from "react-router-dom";
import { testimonials } from "../constants/testimonials";


type Testimonial = {
  name: string;
  content: string;
  designation?: string;
  avatar?: string;
};
export const Testimonials = () => {
  return (
    <div
      id="testimonials"
      className=" px-4 bg-white dark:bg-darkbg py-20 md:py-40 relative group overflow-hidden"
    >
      <div className="absolute  h-96 -top-64 inset-x-0 w-1/2 mx-auto bg-gradient-to-t from-[#9890e3] to-[#b1f4cf] blur-3xl  rounded-full opacity-50" />
      <div className="max-w-xl md:mx-auto md:text-center xl:max-w-none relative z-10 flex flex-col items-center">
        <h2 className="font-display text-3xl tracking-tight text-zinc-900 dark:text-white sm:text-4xl md:text-5xl text-center">
          See what our users say about us
        </h2>
        <p className="mt-6 mb-6 text-lg tracking-tight text-zinc-600 dark:text-darktext text-center">
          How has Guided Helped you in your Faith?
        </p>
        <Link to="/feedback" className="submit-btn">Let us Know</Link>
      </div>

      <div className="max-w-6xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-4 mt-20">
        {testimonials.map((testimonial: Testimonial, idx: number) => (
          <>
            <TestimonialCard key={`testimonial-${idx}`} {...testimonial} />
          </>
        ))}
      </div>
    </div>
  );
};

const TestimonialCard = ({
  name,
  content,
  designation,
  avatar,
}: Testimonial) => {
  return (
    <div className="shadow-lg border dark:border-none dark:bg-darkaccent px-8 py-12 rounded-xl  flex-1 mb-8">
      <p className="text-xl md:text-2xl font-normal text-neutral-800 dark:text-darktext leading-relaxed">
        {content}
      </p>

      <div className="flex flex-row space-x-2 mt-8">
        <img src={avatar} className="w-[40px] h-[40px] rounded-full border border-gray-100 dark:border-none" />

        <div className="flex flex-col">
          <p className="text-sm text-black dark:text-white">{name}</p>
          <p className="text-xs dark:text-darktext">{designation}</p>
        </div>
      </div>
    </div>
  );
};
