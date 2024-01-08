import dynamic from "next/dynamic";
const Home = dynamic(() => import("./_app"), { ssr: false });

export default function Page() {
  return <Home />;
}
