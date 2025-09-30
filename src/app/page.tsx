import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateRoomForm } from "@/components/create-room-form";
import { JoinRoomForm } from "@/components/join-room-form";
import { Share2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentRooms } from "@/components/recent-rooms";
import Footer from "@/components/footer";

const faqs = [
  {
    question: "How does this app work?",
    answer:
      "Create a media room with an event name, set your desired expiry time in minutes, and share the room link with participants. Everyone can upload, view, and download photos until the room expires.",
  },
  {
    question: "Can I set any expiry time for my room?",
    answer:
      "Yes, you can choose how many minutes the room should stay active. After the expiry, all media and the room are automatically and permanently deleted.",
  },
  {
    question: "Do I need to create another WhatsApp group for each event?",
    answer:
      "No! This app replaces the hassle of event groups—just create a media room and share its link.",
  },
  {
    question: "Who can delete media in a room?",
    answer:
      "The person who uploads a media file can delete it anytime while the room is active. Other users can view and download but cannot delete media uploaded by others.",
  },
  {
    question: "What types of files can be uploaded?",
    answer:
      "For now, only images are supported for fast, event-focused sharing.",
  },
  {
    question: "Is the data really deleted after expiry?",
    answer:
      "Yes, media and room details are permanently removed after expiration, with no backups.",
  },
  {
    question: "Is there a limit to how many files I can upload?",
    answer:
      "You can upload multiple files at once, but there may be a maximum size or count based on server capacity.",
  },
  {
    question: "How secure is my event room?",
    answer:
      "Rooms are protected by a unique ID and optional password. Only invited users with the link and password can access and contribute to a room.",
  },
];

export default function HomePage() {
  return (
    <section className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="z-10 mx-auto flex max-w-4xl flex-col items-center gap-14 text-center mb-20">
          <Share2Icon />
          <div>
            <h1 className="mb-4 text-3xl font-medium text-pretty lg:text-6xl">
              Share Event Memories Without the WhatsApp Chaos
            </h1>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Create temporary rooms to share and collect photos from events,
              meetings, or gatherings with friends and colleagues.
            </p>
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-6 lg:flex-row">
            <Tabs defaultValue="create" className="max-w-xl w-full">
              <TabsList className="mb-2 grid w-full grid-cols-2">
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="join">Join</TabsTrigger>
              </TabsList>
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle>Create a Room</CardTitle>
                    <CardDescription>
                      Create a new room for collaboration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CreateRoomForm />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="join">
                <Card>
                  <CardHeader>
                    <CardTitle>Join a Room</CardTitle>
                    <CardDescription>
                      Join an existing room for collaboration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <JoinRoomForm />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <RecentRooms />
          </div>
          <p className="mt-6 font-medium text-muted-foreground">
            Find out all the essential details about our platform and how it can
            serve your needs.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            {faqs.map((faq, index) => (
              <div key={faq.question} className="mb-8 flex gap-4 text-left">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-sm bg-secondary font-mono text-xs text-primary">
                  {index + 1}
                </span>
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-medium">{faq.question}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </section>
  );
}
