import { useCallback, useEffect, useRef, useState } from "react";
import { HomePage } from "./components/HomePage";
import { PracticePage } from "./components/PracticePage";
import { getEssayById } from "./data/essays";

type Route =
  | { name: "home" }
  | { name: "essay"; essayId: string }
  | { name: "not-found" };

function readRoute(): Route {
  const hash = window.location.hash;
  if (!hash || hash === "#" || hash === "#/") {
    return { name: "home" };
  }

  const match = hash.match(/^#\/essay\/([^/]+)$/);
  if (!match) {
    return { name: "not-found" };
  }

  try {
    return { name: "essay", essayId: decodeURIComponent(match[1]) };
  } catch {
    return { name: "not-found" };
  }
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => readRoute());
  const routeRef = useRef(route);
  const isDirtyRef = useRef(false);
  const allowNavigationRef = useRef(false);
  const lastAcceptedHashRef = useRef(window.location.hash || "#/");

  useEffect(() => {
    routeRef.current = route;
  }, [route]);

  useEffect(() => {
    function handleHashChange() {
      const nextRoute = readRoute();
      const leavingDirtyEssay =
        routeRef.current.name === "essay" &&
        (nextRoute.name !== "essay" ||
          nextRoute.essayId !== routeRef.current.essayId) &&
        isDirtyRef.current;

      if (
        leavingDirtyEssay &&
        !allowNavigationRef.current &&
        !window.confirm("本次练习尚未完成，确定放弃并返回首页吗？")
      ) {
        window.history.replaceState(null, "", lastAcceptedHashRef.current);
        return;
      }

      allowNavigationRef.current = false;
      if (nextRoute.name === "essay" && !getEssayById(nextRoute.essayId)) {
        lastAcceptedHashRef.current = window.location.hash || "#/";
        setRoute({ name: "not-found" });
        return;
      }

      lastAcceptedHashRef.current = window.location.hash || "#/";
      setRoute(nextRoute);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateToEssay = useCallback((essayId: string) => {
    window.location.hash = `#/essay/${encodeURIComponent(essayId)}`;
    lastAcceptedHashRef.current = window.location.hash;
    setRoute({ name: "essay", essayId });
  }, []);

  const navigateHome = useCallback(() => {
    allowNavigationRef.current = true;
    isDirtyRef.current = false;
    window.location.hash = "#/";
    lastAcceptedHashRef.current = "#/";
    setRoute({ name: "home" });
  }, []);

  const requestGoHome = useCallback(() => {
    if (
      isDirtyRef.current &&
      !window.confirm("本次练习尚未完成，确定放弃并返回首页吗？")
    ) {
      return;
    }
    navigateHome();
  }, [navigateHome]);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    isDirtyRef.current = dirty;
  }, []);

  if (route.name === "home") {
    return <HomePage onSelectEssay={navigateToEssay} />;
  }

  if (route.name === "not-found") {
    return (
      <main className="not-found">
        <p className="eyebrow">404</p>
        <h1>没有找到这篇文章</h1>
        <button className="primary-button" type="button" onClick={navigateHome}>
          返回首页
        </button>
      </main>
    );
  }

  const essay = getEssayById(route.essayId);
  if (!essay) {
    return (
      <main className="not-found">
        <p className="eyebrow">404</p>
        <h1>没有找到这篇文章</h1>
        <button className="primary-button" type="button" onClick={navigateHome}>
          返回首页
        </button>
      </main>
    );
  }

  return (
    <PracticePage
      key={essay.id}
      essay={essay}
      onGoHome={navigateHome}
      onDirtyChange={handleDirtyChange}
      requestGoHome={requestGoHome}
    />
  );
}
