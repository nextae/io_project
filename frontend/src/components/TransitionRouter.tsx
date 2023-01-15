import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { BrowserRouterProps, Router } from "react-router-dom";
import { createBrowserHistory, BrowserHistory } from "@remix-run/router";

const TransitionContext = createContext<boolean>(false);

export function useLoadingState() {
  return useContext(TransitionContext);
}

/**
 * A wrapper over the `react-router-dom` `BrowserRouter` that uses the `useTransition` hook to
 * provide a loading state. This is used to display a loading overlay when transitioning between
 * pages.
 */
export const TransitionRouter = ({ window, ...rest }: BrowserRouterProps) => {
  const historyRef = useRef<BrowserHistory>();
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window, v5Compat: true });
  }

  const history = historyRef.current;
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  const [isPending, startTransition] = useTransition();

  useLayoutEffect(() => {
    return history.listen((update) => {
      startTransition(() => {
        setState(update);
      });
    });
  }, [history]);

  return (
    <TransitionContext.Provider value={isPending}>
      <Router
        {...rest}
        location={state.location}
        navigationType={state.action}
        navigator={history}
      />
    </TransitionContext.Provider>
  );
};
