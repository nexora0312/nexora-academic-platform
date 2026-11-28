"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiRequestError } from "../../../services/api-client";
import { userApi } from "../services/user-api";
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../types/user.types";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authenticationRequired, setAuthenticationRequired] = useState(false);

  const setRequestError = useCallback((requestError: unknown) => {
    setError(
      requestError instanceof Error
        ? requestError.message
        : "Unable to load users.",
    );
    setAuthenticationRequired(
      requestError instanceof ApiRequestError && requestError.status === 401,
    );
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setUsers(await userApi.list());
      setAuthenticationRequired(false);
    } catch (requestError) {
      setRequestError(requestError);
    } finally {
      setIsLoading(false);
    }
  }, [setRequestError]);

  useEffect(() => {
    let isMounted = true;
    userApi
      .list()
      .then((loadedUsers) => {
        if (isMounted) {
          setUsers(loadedUsers);
          setAuthenticationRequired(false);
        }
      })
      .catch((requestError: unknown) => {
        if (isMounted) {
          setRequestError(requestError);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [setRequestError]);

  const createUser = useCallback(
    async (input: CreateUserInput) => {
      try {
        await userApi.create(input);
      } catch (requestError) {
        if (
          requestError instanceof ApiRequestError &&
          requestError.status === 401
        ) {
          setAuthenticationRequired(true);
        }
        throw requestError;
      }
      await refresh();
    },
    [refresh, setAuthenticationRequired],
  );

  const updateUser = useCallback(
    async (id: string, input: UpdateUserInput) => {
      try {
        await userApi.update(id, input);
      } catch (requestError) {
        if (
          requestError instanceof ApiRequestError &&
          requestError.status === 401
        ) {
          setAuthenticationRequired(true);
        }
        throw requestError;
      }
      await refresh();
    },
    [refresh, setAuthenticationRequired],
  );

  const getUser = useCallback(async (id: string) => {
    try {
      return await userApi.get(id);
    } catch (requestError) {
      if (
        requestError instanceof ApiRequestError &&
        requestError.status === 401
      ) {
        setAuthenticationRequired(true);
      }
      throw requestError;
    }
  }, [setAuthenticationRequired]);

  return {
    users,
    isLoading,
    error,
    authenticationRequired,
    refresh,
    getUser,
    createUser,
    updateUser,
  };
}
