interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const VideoPage = async ({ params }: PageProps) => {
  const { videoId } = await params;
  return <div>VideoPage {videoId}</div>;
};

export default VideoPage;
