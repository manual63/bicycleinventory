import { useCallback, useEffect } from "react";
import { getErrorMessage } from "../libs/utils";
import { useBikeRepository } from "../repositories/BikeRepositoryContext";
import { useBikeStore } from "../store/bikeStore";
import { useToastStore } from "../store/toastStore";

export const useLoadBikes = () => {
  const status = useBikeStore((s) => s.status);
  const loadStarted = useBikeStore((s) => s.loadStarted);
  const loadFailed = useBikeStore((s) => s.loadFailed);
  const showToast = useToastStore((s) => s.showToast);
  const setBikes = useBikeStore((s) => s.setBikes);
  const repository = useBikeRepository();

  const loadBikes = useCallback(() => {
    repository.getAll().then((bikes) => {
      setBikes(bikes);
    }).catch((error) => {
      loadFailed();
      showToast(`Error loading bikes! Message: ${getErrorMessage(error)}`, "error");
    });
  }, [repository, setBikes, showToast, loadFailed]);

  useEffect(() => {
    const currentStatus = useBikeStore.getState().status;   // peek at the store, right now
    if (currentStatus === "ready") return;                  // case 1: nothing to do, stop here
    if (currentStatus === "error") loadStarted();           // case 3: switch back to "loading" first
    loadBikes();                                     // cases 2 and 3 both end up here
  }, [loadBikes, loadStarted]);

  const retry = () => {
    loadStarted();
    loadBikes();
  }

  return { status, retry };
}
