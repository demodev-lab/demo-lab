SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', '354f7a2b-42c3-4920-b36a-661561d16e4f', '{"action":"user_confirmation_requested","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-05-27 13:46:57.104418+00', ''),
	('00000000-0000-0000-0000-000000000000', '9e4a440e-461f-4205-a961-7ee7af5d6567', '{"action":"user_signedup","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"team"}', '2025-05-27 13:47:13.254001+00', ''),
	('00000000-0000-0000-0000-000000000000', '36eca0a3-c4d7-4e47-802e-07257079944a', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 13:48:20.670115+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a27d35da-bd38-43d2-8532-689bc2305a51', '{"action":"user_repeated_signup","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-05-27 13:55:39.403162+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a80e202d-0d14-441b-b1ce-ee95c966eb98', '{"action":"user_repeated_signup","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-05-27 13:56:21.342732+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e8ae003-1a77-4bff-bfda-ceb7ea5c2e3a', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 13:57:03.172026+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c5283cc2-178d-4e67-9082-37c03c4f0ff8', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-05-27 13:57:07.444107+00', ''),
	('00000000-0000-0000-0000-000000000000', 'daf26a9f-657d-4f53-92a1-fad15ba32948', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 13:57:22.790522+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b39a6a6a-fbc0-49f1-b6df-e3effdb9d109', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-05-27 14:29:15.098513+00', ''),
	('00000000-0000-0000-0000-000000000000', 'be5f5b7a-0051-4877-b745-5433610fc82b', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 14:29:26.85495+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bd9fd6a-9a1c-4617-9b69-41f55c1c60f7', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-05-27 14:29:41.279727+00', ''),
	('00000000-0000-0000-0000-000000000000', '007043ac-743c-473a-96dd-70a58b5529d5', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 14:29:52.815637+00', ''),
	('00000000-0000-0000-0000-000000000000', '2146132f-cc81-4b2c-a044-c832a56deed2', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-27 14:48:22.111667+00', ''),
	('00000000-0000-0000-0000-000000000000', '172ba97f-6b03-4724-9bf5-1e2663d58c7e', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-28 11:57:19.843036+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c27789f-d4f6-480c-8895-38b39618f308', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 09:53:52.772752+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ad4988c-fd24-465e-bc66-2a3790ae5219', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 09:53:52.791132+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f86628e-dae8-4963-b419-fb5a272ac716', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-05-30 09:53:56.506306+00', ''),
	('00000000-0000-0000-0000-000000000000', '17560d58-4672-47b8-8f78-07a25548b569', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-05-30 09:54:24.557166+00', ''),
	('00000000-0000-0000-0000-000000000000', '53008341-4fb7-4c56-bd4a-89d60a4defbb', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 11:06:35.457538+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6cc4082-e329-431b-b240-e966f16b30ab', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-05-30 11:06:35.461497+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da9128e1-b2b4-4c07-90f3-13a96ff24988', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-05-30 11:06:42.178574+00', ''),
	('00000000-0000-0000-0000-000000000000', '2925362e-cede-473b-b9cd-d9265db01065', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-05-30 12:50:57.620872+00', ''),
	('00000000-0000-0000-0000-000000000000', '86de3eef-fa39-450a-9efa-15e210b1661f', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-05-30 12:50:57.793607+00', ''),
	('00000000-0000-0000-0000-000000000000', '77bb98d5-68a0-436b-9181-58236de5ce8b', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-05-30 12:56:51.772259+00', ''),
	('00000000-0000-0000-0000-000000000000', '73446701-c55d-4a19-8fd1-99fe328ec307', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-05-30 12:56:51.889569+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b716ca38-87bd-446b-9fcb-b656ca5eb6e5', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-01 11:35:32.868712+00', ''),
	('00000000-0000-0000-0000-000000000000', '556980f7-9015-4e51-bce7-48ab56733d2a', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-01 11:35:32.884147+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e3345a5-f5f3-4387-a339-b6d61ff3aa42', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-01 11:45:11.149546+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0b7499c-994b-48fc-b38e-7a5e66925eaa', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-01 11:45:45.927347+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8a59398-b355-4e4d-b972-daa22d018fac', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-01 11:45:46.511531+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfaafe6f-de40-4cfd-8e7e-bf4f374bf5fb', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-02 11:14:58.173682+00', ''),
	('00000000-0000-0000-0000-000000000000', '16980956-2581-40db-bfe0-db14f6575aa6', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-02 11:14:58.191635+00', ''),
	('00000000-0000-0000-0000-000000000000', '62f93744-47ca-4413-979d-ba7a48cc395b', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-04 10:12:37.804795+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ed604ced-72f4-4bcc-afca-30485827a1f1', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-04 10:12:37.814629+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd5da3bf4-3ff1-4ef9-8abf-f1364fb62cbc', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-04 11:37:30.124158+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd8b4cd6b-4ae6-48fe-886c-ada6ce57003f', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-04 11:37:30.127793+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c2c49690-50db-4840-85c5-02799e7b263a', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-04 12:24:07.716042+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e51b5fe7-601f-4649-a3cc-fcc7e9cf472f', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-04 12:45:50.581831+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bf4794f5-1817-4d8d-8b17-4f805e1ea606', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-04 12:45:50.747591+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b44e6fbb-44ce-4109-aae6-d354b5d75571', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-04 12:58:52.691901+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b54000db-f4bf-4e31-878d-27236c700c88', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-04 12:58:53.490198+00', ''),
	('00000000-0000-0000-0000-000000000000', '6af3908b-2e4c-4435-a746-61e9801f5d22', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-04 13:01:59.932299+00', ''),
	('00000000-0000-0000-0000-000000000000', '0d75f50a-de16-4cae-83f5-066a90388d3c', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-04 13:02:00.89605+00', ''),
	('00000000-0000-0000-0000-000000000000', '68da7383-05d1-4a2f-adf8-80694f0f9234', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-04 13:04:01.961018+00', ''),
	('00000000-0000-0000-0000-000000000000', '49be89e7-70bd-4f28-a8af-750aeaa3d87c', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-04 13:04:02.16516+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dfc99322-0bb7-41c3-be42-7627e873fde9', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-04 13:10:47.85945+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e673f153-18a2-49bf-9a30-c5bf79b20067', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-04 13:10:48.592192+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6d8723a-26a9-442a-8dd8-59fd294abd3f', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-04 13:26:43.307677+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6092abc-2fc4-47b1-a221-edc2b8c982a4', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-04 13:26:57.888109+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a6dad5e-09f1-485b-9809-2e64e471dfb2', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-04 13:26:58.382947+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fcac9cec-ceb7-4871-87d9-81378169da35', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-04 13:27:10.391582+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f4deb31-9f49-452b-b5a9-04e9a167809a', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-04 13:27:18.947708+00', ''),
	('00000000-0000-0000-0000-000000000000', '34763dde-fe7c-4d51-8413-58fe32062f87', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 06:56:25.711801+00', ''),
	('00000000-0000-0000-0000-000000000000', '62c7630f-12dd-47d1-bd5c-85c8bbd8bba4', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 06:56:25.732466+00', ''),
	('00000000-0000-0000-0000-000000000000', '132ba034-f964-4946-878f-57209a48a2e5', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 07:56:48.306704+00', ''),
	('00000000-0000-0000-0000-000000000000', '2ee5b31f-a76c-4104-93c8-d2b9dcb6a56a', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 07:56:48.309443+00', ''),
	('00000000-0000-0000-0000-000000000000', '71c7f7db-e05a-4c14-851e-200db93bd165', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-06 08:06:55.381692+00', ''),
	('00000000-0000-0000-0000-000000000000', '0772d544-7b4c-4c57-89bc-4574eda5bbae', '{"action":"user_signedup","actor_id":"747ac99f-7399-42a9-a7c5-53f08e38484d","actor_name":"안준성","actor_username":"ahnjs960918@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"google"}}', '2025-06-06 08:07:10.377059+00', ''),
	('00000000-0000-0000-0000-000000000000', '3df67eca-e245-4970-998a-a2c61422a97d', '{"action":"login","actor_id":"747ac99f-7399-42a9-a7c5-53f08e38484d","actor_name":"안준성","actor_username":"ahnjs960918@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2025-06-06 08:07:10.495056+00', ''),
	('00000000-0000-0000-0000-000000000000', '738010b3-2fe4-46f5-9936-4d4f8745a25a', '{"action":"logout","actor_id":"747ac99f-7399-42a9-a7c5-53f08e38484d","actor_name":"안준성","actor_username":"ahnjs960918@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-06 08:07:29.089979+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ef325f0-c5cd-452f-818b-5aad4ac81d4e', '{"action":"user_repeated_signup","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2025-06-06 08:08:17.851525+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d6d2740-9371-4a4b-bb12-57f768186663', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2025-06-06 08:08:37.357359+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a4277b7-a5fb-4a72-9958-5af4595056b5', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 09:32:40.88266+00', ''),
	('00000000-0000-0000-0000-000000000000', '22343e7d-eb35-44d9-9925-840fc73e8dc4', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 09:32:40.886551+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ce6e58c-205f-4d26-b6ec-4754d5f6bf5a', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 10:31:10.418741+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fef807ee-01e4-4f49-b522-583efd708773', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 10:31:10.42547+00', ''),
	('00000000-0000-0000-0000-000000000000', '5ca36fb6-f790-4db8-b596-c305d985fc44', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 10:31:10.450099+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd0455b63-ec55-4d6e-8c2e-8015a8064d87', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-06 11:21:39.564919+00', ''),
	('00000000-0000-0000-0000-000000000000', '35f27bff-a35e-484a-b331-de8a4d1a4d88', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-06 11:21:57.781608+00', ''),
	('00000000-0000-0000-0000-000000000000', '68534e1e-343f-409d-a4e1-7566f649fe2a', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-06 11:23:48.93187+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3f23673-d251-4b57-bfa1-346d0df3ff0c', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 12:44:42.238082+00', ''),
	('00000000-0000-0000-0000-000000000000', '52c531db-fef3-44a3-83d3-c371a881f837', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-06 12:44:42.245567+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c85f7d9-9b3d-4862-943e-2459583ca1a7', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-06 13:07:01.450511+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbe331ee-6c67-4abb-a68d-f52989465660', '{"action":"login","actor_id":"747ac99f-7399-42a9-a7c5-53f08e38484d","actor_name":"안준성","actor_username":"ahnjs960918@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2025-06-06 13:07:08.92915+00', ''),
	('00000000-0000-0000-0000-000000000000', '80abc036-d001-4eac-a75f-4b2ab6c26cbb', '{"action":"login","actor_id":"747ac99f-7399-42a9-a7c5-53f08e38484d","actor_name":"안준성","actor_username":"ahnjs960918@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2025-06-06 13:07:09.581423+00', ''),
	('00000000-0000-0000-0000-000000000000', '69c6193f-7d6e-4f81-8e77-c2cc26e20ed6', '{"action":"logout","actor_id":"747ac99f-7399-42a9-a7c5-53f08e38484d","actor_name":"안준성","actor_username":"ahnjs960918@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-06-06 13:07:41.368777+00', ''),
	('00000000-0000-0000-0000-000000000000', '2d048229-3c12-4c94-b1a8-3b3e7694c80e', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-06 13:07:47.135521+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4efdc74-54d8-45a8-be86-5e6c9b7e2f63', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-06 13:07:47.196676+00', ''),
	('00000000-0000-0000-0000-000000000000', '86a4817b-0d13-4096-941d-886b9d3bbbe1', '{"action":"token_refreshed","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-07 04:10:21.132775+00', ''),
	('00000000-0000-0000-0000-000000000000', '676c3b52-a820-45a8-ac5a-78b43e0d3f98', '{"action":"token_revoked","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"token"}', '2025-06-07 04:10:21.145459+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e3ed9c62-12ed-47e1-acbb-ea9833a08657', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-07 04:44:09.94014+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6398b91-f8cb-49b8-87e0-090eb6c87c12', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"kakao"}}', '2025-06-07 06:09:19.385795+00', ''),
	('00000000-0000-0000-0000-000000000000', '78f3a070-ec29-44f8-9907-75e2cffc5726', '{"action":"login","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"kakao"}}', '2025-06-07 06:09:20.136573+00', ''),
	('00000000-0000-0000-0000-000000000000', '74784e5b-fd63-490a-861f-27d2ebb7ac83', '{"action":"logout","actor_id":"d984c402-358b-4629-819c-50a519c707db","actor_name":"안준성","actor_username":"tjdtna01@naver.com","actor_via_sso":false,"log_type":"account"}', '2025-06-07 06:26:49.976409+00', ''),
	('00000000-0000-0000-0000-000000000000', '81a56340-e90a-4722-9c97-d37eb0c362ed', '{"action":"login","actor_id":"747ac99f-7399-42a9-a7c5-53f08e38484d","actor_name":"안준성","actor_username":"ahnjs960918@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"google"}}', '2025-06-07 06:27:10.594962+00', ''),
	('00000000-0000-0000-0000-000000000000', 'afb74336-9f48-4dc8-b024-67954fc41897', '{"action":"login","actor_id":"747ac99f-7399-42a9-a7c5-53f08e38484d","actor_name":"안준성","actor_username":"ahnjs960918@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"google"}}', '2025-06-07 06:27:11.500196+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('ed214d82-de26-4320-a788-fb1334945ae7', NULL, 'c2b342cb-6deb-4505-85e5-869886304144', 's256', 'q5GVYsl-fhQ36CWldmoYcAV3hVFaPwRXx9YNmHABINA', 'google', '', '', '2025-06-06 08:07:00.539426+00', '2025-06-06 08:07:00.539426+00', 'oauth', NULL);


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'd984c402-358b-4629-819c-50a519c707db', 'authenticated', 'authenticated', 'tjdtna01@naver.com', '$2a$10$z8ZDMVm4pzrYFKORcDlgfem1aLMJizdgYG59qRnSokqoCiV07Kpna', '2025-05-27 13:47:13.254766+00', NULL, '', '2025-05-27 13:46:57.11367+00', '', NULL, '', '', NULL, '2025-06-07 06:09:20.137759+00', '{"provider": "email", "providers": ["email", "kakao"]}', '{"iss": "https://kapi.kakao.com", "sub": "4283915132", "name": "안준성", "email": "tjdtna01@naver.com", "full_name": "안준성", "user_name": "안준성", "avatar_url": "http://k.kakaocdn.net/dn/BEF15/btsMPpTNmF3/SIOAaDZ5Rz5QRyaQFSPpiK/img_640x640.jpg", "provider_id": "4283915132", "email_verified": true, "phone_verified": false, "preferred_username": "안준성"}', NULL, '2025-05-27 13:46:57.055009+00', '2025-06-07 06:09:20.154087+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '747ac99f-7399-42a9-a7c5-53f08e38484d', 'authenticated', 'authenticated', 'ahnjs960918@gmail.com', NULL, '2025-06-06 08:07:10.377595+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-06-07 06:27:11.500762+00', '{"provider": "google", "providers": ["google"]}', '{"iss": "https://accounts.google.com", "sub": "114279179852107646829", "name": "안준성", "email": "ahnjs960918@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKKSnd3QSyL_L5I4NSRi6SwfSGx7zAXqUU7OBY5denxU6kW=s96-c", "full_name": "안준성", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKKSnd3QSyL_L5I4NSRi6SwfSGx7zAXqUU7OBY5denxU6kW=s96-c", "provider_id": "114279179852107646829", "email_verified": true, "phone_verified": false}', NULL, '2025-06-06 08:07:10.358199+00', '2025-06-07 06:27:11.503781+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('d984c402-358b-4629-819c-50a519c707db', 'd984c402-358b-4629-819c-50a519c707db', '{"sub": "d984c402-358b-4629-819c-50a519c707db", "email": "tjdtna01@naver.com", "email_verified": true, "phone_verified": false}', 'email', '2025-05-27 13:46:57.091911+00', '2025-05-27 13:46:57.091968+00', '2025-05-27 13:46:57.091968+00', '96e7096f-5e6f-449e-8300-bcacb705c465'),
	('4283915132', 'd984c402-358b-4629-819c-50a519c707db', '{"iss": "https://kapi.kakao.com", "sub": "4283915132", "name": "안준성", "email": "tjdtna01@naver.com", "full_name": "안준성", "user_name": "안준성", "avatar_url": "http://k.kakaocdn.net/dn/BEF15/btsMPpTNmF3/SIOAaDZ5Rz5QRyaQFSPpiK/img_640x640.jpg", "provider_id": "4283915132", "email_verified": true, "phone_verified": false, "preferred_username": "안준성"}', 'kakao', '2025-05-30 12:50:57.615316+00', '2025-05-30 12:50:57.61537+00', '2025-06-07 06:09:19.378978+00', '6ef2414c-0f2d-4918-b7ba-425676d2e281'),
	('114279179852107646829', '747ac99f-7399-42a9-a7c5-53f08e38484d', '{"iss": "https://accounts.google.com", "sub": "114279179852107646829", "name": "안준성", "email": "ahnjs960918@gmail.com", "picture": "https://lh3.googleusercontent.com/a/ACg8ocKKSnd3QSyL_L5I4NSRi6SwfSGx7zAXqUU7OBY5denxU6kW=s96-c", "full_name": "안준성", "avatar_url": "https://lh3.googleusercontent.com/a/ACg8ocKKSnd3QSyL_L5I4NSRi6SwfSGx7zAXqUU7OBY5denxU6kW=s96-c", "provider_id": "114279179852107646829", "email_verified": true, "phone_verified": false}', 'google', '2025-06-06 08:07:10.371031+00', '2025-06-06 08:07:10.371084+00', '2025-06-07 06:27:10.589289+00', '82428cd4-79f5-4992-ad3b-5362ddf4a543');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('c45a1ba5-b3e1-4e30-98bd-3fde718d25a4', '747ac99f-7399-42a9-a7c5-53f08e38484d', '2025-06-07 06:27:11.500858+00', '2025-06-07 06:27:11.500858+00', NULL, 'aal1', NULL, NULL, 'node', '121.135.181.35', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('c45a1ba5-b3e1-4e30-98bd-3fde718d25a4', '2025-06-07 06:27:11.504299+00', '2025-06-07 06:27:11.504299+00', 'oauth', 'd5156a4e-ffc6-4e57-8ac7-b1ccf38f21eb');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 38, 'gyysg6f6q45t', '747ac99f-7399-42a9-a7c5-53f08e38484d', false, '2025-06-07 06:27:11.501731+00', '2025-06-07 06:27:11.501731+00', NULL, 'c45a1ba5-b3e1-4e30-98bd-3fde718d25a4');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('demo-lab-storage', 'demo-lab-storage', NULL, '2025-05-30 10:57:56.394021+00', '2025-05-30 10:57:56.394021+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 38, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 1, false);


--
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."comments_id_seq"', 1, false);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."posts_id_seq"', 1, false);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tags_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
