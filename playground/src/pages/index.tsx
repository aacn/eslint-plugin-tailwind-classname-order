import { CSSProperties } from "react";

function Home() {
    const secretVar = "mt-2";

    function tailwind(className: string): CSSProperties {
        return className as CSSProperties;
    }

  return (
      <main>
          <h2 className="text-3xl font-bold mt-3 flex pt-3">Playground</h2>
          <h2 aria-label="huhu" style={tailwind("mt-3 pt-3")}>Playground</h2>
          <h2 className={"text-3xl font-bold mt-3 flex pt-3"}></h2>
          <h2 className={`flex px-3 mt-0 mr-5 pt-1 font-bold ${secretVar} mx-4 ${secretVar} text-3xl ${secretVar} mt-2`}></h2>
      </main>
  )
}

export default Home;
