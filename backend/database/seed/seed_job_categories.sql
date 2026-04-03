INSERT INTO job_categories (id, parent_id, level_num, category_name, category_code)
VALUES
(1, NULL, 1, 'IT·데이터', 'IT'),
(2, NULL, 1, '돌봄·복지', 'CARE'),
(3, NULL, 1, '사무·행정', 'OFFICE'),

(4, 1, 2, '데이터 분석', 'IT_DATA'),
(5, 1, 2, '웹개발', 'IT_WEB'),
(6, 2, 2, '요양보호', 'CARE_YO'),
(7, 3, 2, '행정지원', 'OFFICE_ADMIN'),

(8, 4, 3, '인공지능학습데이터구축', 'IT_DATA_AI'),
(9, 4, 3, '데이터 시각화', 'IT_DATA_VIS'),
(10, 5, 3, '프론트엔드', 'IT_WEB_FE'),
(11, 6, 3, '요양보호사', 'CARE_YO_MAIN'),
(12, 7, 3, '사무보조', 'OFFICE_ADMIN_ASSIST');