CREATE TABLE `term_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `name` varchar(50) NOT NULL comment 'terminology name',
  `synonym` varchar(50) comment 'synonym',
  `description` varchar(255) comment 'description',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `llm_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `connection_name` varchar(50) NOT NULL comment 'connection name',
  `api_protocal` varchar(50) NOT NULL comment 'api protocal',
  `base_url` varchar(255) comment 'base url',
  `api_key` varchar(255) comment 'api key',
  `model_name` varchar(255) comment 'model name',
  `api_version` varchar(50) comment 'api version',
  `temperature` float comment 'temperature',
  `timeout` INT UNSIGNED comment 'connection timeout',
  `description` varchar(255) comment 'description',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `database_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `name` varchar(50) NOT NULL comment 'database name',
  `type` varchar(50) comment 'database type',
  `jdbc_str` varchar(255) comment 'jdbc string',
  `version` varchar(50) comment 'database version',
  `user` varchar(255) comment 'user',
  `password` varchar(50) comment 'password',
  `description` varchar(255) comment 'description',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `model_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `database_id` BIGINT UNSIGNED NOT NULL comment 'database connection id',
  `database_name` varchar(50) comment 'database name',
  `table_name` varchar(255) comment 'table name',
  `model_name` varchar(50) comment 'model name',
  `description` varchar(255) comment 'description',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `model_dimension_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `model_id` BIGINT UNSIGNED NOT NULL comment 'model id',
  `name` varchar(50) NOT NULL comment 'name',
  `alias` varchar(50) comment 'alias',
  `dimension_type` varchar(50) comment 'dimension type',
  `description` varchar(50) comment 'description',
  `express` varchar(255) comment 'express',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `model_metric_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `model_id` BIGINT UNSIGNED NOT NULL comment 'model id',
  `name` varchar(50) NOT NULL comment 'name',
  `alias` varchar(50) comment 'alias',
  `metric_type` varchar(50) comment 'metric type',
  `description` varchar(255) comment 'description',
  `express` varchar(255) comment 'express',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `dataset_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `name` varchar(50) NOT NULL comment 'name',
  `description` varchar(255) comment 'description',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `dataset_dimension_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `dataset_id` BIGINT UNSIGNED  NOT NULL comment 'dataset id',
  `dimension_id` BIGINT UNSIGNED  NOT NULL comment 'dimension id',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `dataset_metric_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `dataset_id` BIGINT UNSIGNED  NOT NULL comment 'dataset id',
  `metric_id` BIGINT UNSIGNED  NOT NULL comment 'dimension id',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `analysis_assistant_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `name` varchar(50) NOT NULL comment 'name',
  `description` varchar(255) comment 'description',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `analysis_assistant_dataset_tbl` (
  `id` BIGINT UNSIGNED NOT NULL comment 'primary key id',
  `analysis_assistant_id` BIGINT UNSIGNED NOT NULL comment 'analysis assistant id',
  `dataset_id` BIGINT UNSIGNED NOT NULL comment 'dataset id',
  `create_by` varchar(50) DEFAULT NULL comment 'create user',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment 'create time',
  `update_by` varchar(50) DEFAULT NULL comment 'update user',
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'update time',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;