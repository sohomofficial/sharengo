import {
  PhotoSkeleton,
  RoomHeaderSkeleton,
  UploadFormSkeleton,
} from "@/components/ui/loading-skeletons";
import Footer from "@/components/footer";

export default function RoomLoading() {
  return (
    <main className="container pb-24 sm:pb-32 mx-auto pt-16 max-w-4xl px-4 sm:px-6 lg:px-8">
      <RoomHeaderSkeleton />

      <section className="mb-8">
        <UploadFormSkeleton />
      </section>

      <section className="mb-20">
        <h2 className="sr-only">Gallery Loading</h2>
        <PhotoSkeleton count={8} />
      </section>

      <Footer />
    </main>
  );
}
