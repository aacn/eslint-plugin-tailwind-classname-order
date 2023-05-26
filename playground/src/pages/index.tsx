import { CSSProperties } from "react";

function Home() {
    const secretVar = "mt-2";
    const props = {
      className: "bg-gray-200 text-gray-700",
      open: true
    }

    function tailwind(className: string): CSSProperties {
        return className as CSSProperties;
    }

    function classNames(classNames: string, _props: string): string {
      return classNames as string;
    }

    function longCall(att1: any, att2: any, att3: any) {
      return att1 + att2 + att3;
    }

  return (
    <main>
      <h2 className="text-3xl font-bold mt-3 flex pt-3">Playground</h2>
      <h2 aria-label="huhu" style={tailwind("mt-3 pt-3")}>Playground</h2>
      <h2 className={"text-3xl font-bold mt-3 flex pt-3"}></h2>
      <h2 className={`flex px-3 mt-0 mr-5 pt-1 font-bold ${secretVar} mx-4 ${secretVar} text-3xl ${secretVar} mt-2`}></h2>
      <h2 className={classNames('z-50 w-full h-[14px] flex flex-col justify-center items-center select-none', props.className)}></h2>
      <h2 className={longCall('h-10 w-10', 'w-full h-[14px] z-50 flex flex-col justify-center items-center select-none', props.className)}></h2>
      <h2 className={`${ props.open ? 'transform rotate-180' : ''} h-5 w-5 text-white`}></h2>
    </main>
  )
}

export default Home;
