#!/bin/bash

# Vault 초기화 스크립트
# JWT Secret Key 자동 생성 및 Vault KV v2에 저장
# Docker 환경에서 curl을 사용하여 Vault API 직접 호출

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Vault 초기화 스크립트 ===${NC}"

# 환경 변수 설정
VAULT_ADDR="${VAULT_ADDR:-http://localhost:8200}"
VAULT_TOKEN="${VAULT_TOKEN:-dev-root-token}"

echo -e "${GREEN}Vault 주소: ${VAULT_ADDR}${NC}"

# Vault 상태 확인
echo -e "${YELLOW}Vault 상태 확인 중...${NC}"
until curl -s "${VAULT_ADDR}/v1/sys/health" > /dev/null 2>&1; do
    echo "Vault가 준비될 때까지 대기 중..."
    sleep 2
done
echo -e "${GREEN}Vault가 준비되었습니다.${NC}"

# KV v2 시크릿 엔진 활성화
echo -e "${YELLOW}KV v2 시크릿 엔진 활성화 중...${NC}"
curl -s -X POST \
    -H "X-Vault-Token: ${VAULT_TOKEN}" \
    -d '{"type": "kv", "options": {"version": "2"}}' \
    "${VAULT_ADDR}/v1/sys/mounts/secret" 2>/dev/null || echo "KV v2 엔진이 이미 활성화되어 있습니다."

# JWT Secret Key 생성 (256비트 = 32바이트)
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}JWT Secret Key가 생성되었습니다.${NC}"

# JWT 시크릿 저장
echo -e "${YELLOW}JWT 설정을 Vault에 저장 중...${NC}"
curl -s -X POST \
    -H "X-Vault-Token: ${VAULT_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
        \"data\": {
            \"secret_key\": \"${JWT_SECRET}\",
            \"algorithm\": \"HS256\",
            \"access_token_expire_minutes\": \"30\",
            \"refresh_token_expire_days\": \"7\"
        }
    }" \
    "${VAULT_ADDR}/v1/secret/data/jwt" > /dev/null

echo -e "${GREEN}JWT 설정이 저장되었습니다.${NC}"

# 데이터베이스 설정 저장
echo -e "${YELLOW}데이터베이스 설정을 Vault에 저장 중...${NC}"
curl -s -X POST \
    -H "X-Vault-Token: ${VAULT_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
        "data": {
            "host": "mysql",
            "port": "3306",
            "user": "root",
            "password": "elql4$4$",
            "database": "starterkit_db"
        }
    }' \
    "${VAULT_ADDR}/v1/secret/data/database" > /dev/null

echo -e "${GREEN}데이터베이스 설정이 저장되었습니다.${NC}"

# 저장된 시크릿 확인
echo -e "${YELLOW}=== 저장된 시크릿 확인 ===${NC}"

echo -e "${GREEN}JWT 설정:${NC}"
curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" \
    "${VAULT_ADDR}/v1/secret/data/jwt" | python3 -m json.tool 2>/dev/null || \
curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" \
    "${VAULT_ADDR}/v1/secret/data/jwt"

echo ""
echo -e "${GREEN}데이터베이스 설정:${NC}"
curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" \
    "${VAULT_ADDR}/v1/secret/data/database" | python3 -m json.tool 2>/dev/null || \
curl -s -H "X-Vault-Token: ${VAULT_TOKEN}" \
    "${VAULT_ADDR}/v1/secret/data/database"

echo ""
echo -e "${GREEN}=== Vault 초기화 완료 ===${NC}"
echo -e "${YELLOW}주의: 프로덕션 환경에서는 반드시 시크릿 값을 변경하세요!${NC}"
