"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/data/messages.json";

const Home = () => {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          Dive into the World of Anonymous Conversations
        </h1>
        <p className="mt-3 md:mt-4 text-base md:text-lg">
          Explore Mystery Message — Where your identity remains a secret.
        </p>
      </section>

      <Carousel
        plugins={[Autoplay({ delay: 3000 })]}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card className="shadow-lg rounded-2xl">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="text-6xl mb-4">{message.emoji}</div>
                    <h2 className="text-xl font-semibold mb-2">
                      {message.title}
                    </h2>
                    <p className="text-base mb-2">{message.content}</p>
                    <span className="text-sm text-gray-500">
                      {message.received}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  );
};

export default Home;
