import { useEffect, useState } from "react";
import {
  initialize,
  requestPermission,
  readRecords,
} from "react-native-health-connect";

const useHealth = () => {
  const [steps, setSteps] = useState<any>(0);

  const [initialized, setInitialized] = useState<boolean>(false);

  const [grantedPermissions, setGrantedPermissions] = useState<boolean>(false);

  useEffect(() => {
    const initializHealthConnect = async () => {
      try {
        const isInitialized = await initialize();
        setInitialized(isInitialized);
        console.log("the health connect is initialized", isInitialized);
      } catch (error) {
        console.log("there is an error in useHealth init", {
          error,
        });
        setInitialized(false);
      }
    };

    initializHealthConnect();
  }, []);

  useEffect(() => {
    const requestHealthPermission = async () => {
      const grantedPermissions = await requestPermission([
        { accessType: "read", recordType: "ActiveCaloriesBurned" },
        { accessType: "read", recordType: "Steps" },
      ]);
      if (!grantedPermissions) {
        console.log("Permission not granted");
        return;
      } else {
        console.log("Permission granted value", grantedPermissions);
        if (grantedPermissions.length > 0) {
          setGrantedPermissions(true);
        } else {
          setGrantedPermissions(false);
          return;
        }
      }
    };
    if (initialized) {
      requestHealthPermission();
    }
  }, [initialized]);

  useEffect(() => {
    const fetchSteps = async () => {
      const currentDate = new Date();
      const beginningOfTheDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        0,
        0,
        0
      );
      const endOfTheDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
        23,
        59,
        59
      );

      try {
        const result = await readRecords("Steps", {
          timeRangeFilter: {
            operator: "between",
            startTime: beginningOfTheDay.toISOString(),
            endTime: endOfTheDay.toISOString(),
          },
        });
        console.log("the steps data is", result);
        setSteps(result);
      } catch (error) {
        console.log("there is an error in useHealth req", {
          ...error,
        });
      }
    };
    if (grantedPermissions) {
      fetchSteps();
    }
  }, [grantedPermissions]);

  return [steps];
};

export default useHealth;
