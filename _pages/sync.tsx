import { useRouter } from "next/router";
import { useEffect, createContext, useState, useContext, useMemo } from "react";

export function useSyncContext() {
  return useContext(SyncContext);
}

export function sendToOtherDevices(word: string) {
  // Tell the server this page has been loaded
  fetch(`/change-route?kanji=${word}`);
}

export function useSync(
  router: ReturnType<typeof useRouter>,
  turnedOn: boolean
) {
  useEffect(() => {
    const source = new EventSource("/stream");

    source.onmessage = function (e) {
      const kanji = (e as any).data;

      // Only refresh when the content actually changes
      if (router.pathname !== "/draw/[id]" || router.query.id !== kanji) {
        router.push(`/draw/${kanji}`, null, {
          shallow: false,
        });
      }
    };

    return () => {
      // TODO: check if this is actually killing the connection
      source.close();
    };
  }, [router, turnedOn]);
}

interface SyncConfigContext {
  syncConfig: {
    locked: boolean;
  };

  toggleLocked: () => void;
}

export const SyncContext = createContext<SyncConfigContext>(undefined);

export function SyncSystem(props: { children: React.ReactNode }) {
  const [syncConfig, setSyncConfig] = useState({
    locked: false,
  });

  const toggleLocked = () =>
    setSyncConfig((v) => ({ ...v, locked: !v.locked }));

  const router = useRouter();
  useSync(router, syncConfig.locked);

  return (
    <SyncContext.Provider value={{ syncConfig, toggleLocked }}>
      {props.children}
    </SyncContext.Provider>
  );
}
