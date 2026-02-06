/**
 * TanStack Query 클라이언트 설정
 * SSR 호환 싱글톤 패턴
 */

import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // 데이터가 stale 상태가 되기까지의 시간 (60초)
        staleTime: 60 * 1000,
        // 가비지 컬렉션까지의 시간 (5분)
        gcTime: 5 * 60 * 1000,
        // 윈도우 포커스 시 자동 refetch 비활성화
        refetchOnWindowFocus: false,
        // 재시도 횟수
        retry: 1,
      },
      mutations: {
        // 뮤테이션 재시도 비활성화
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // 서버: 항상 새 QueryClient 생성
    return makeQueryClient();
  } else {
    // 브라우저: 싱글톤 패턴
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
