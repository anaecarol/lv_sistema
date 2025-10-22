-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Tempo de geração: 29/07/2025 às 14:26
-- Versão do servidor: 8.0.30
-- Versão do PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `l_v`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `categoria`
--

CREATE TABLE `categoria` (
  `id` int NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `icone` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_alteracao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `categoria`
--

INSERT INTO `categoria` (`id`, `tipo`, `icone`, `data_cadastro`, `data_alteracao`) VALUES
(1, 'Sedan', 'icone_sedan.png', '2023-04-26 16:35:16', '2023-04-26 16:35:16'),
(2, 'Hatch', 'icone_hatch.png', '2023-04-26 16:35:16', '2023-04-26 16:35:16'),
(3, 'Perua', 'icone_perua.png', '2023-04-26 16:35:16', '2023-04-26 16:35:16'),
(4, 'SUVs', 'icone_suvs.png', '2023-04-26 16:35:16', '2023-04-26 16:51:52'),
(5, 'Conversível', 'icone_conversivel.png', '2023-04-26 16:35:16', '2023-04-26 16:35:16'),
(6, 'Esport', 'logo_esport.png', '2023-05-04 01:28:10', '2023-05-04 01:30:36');

-- --------------------------------------------------------

--
-- Estrutura para tabela `montadora`
--

CREATE TABLE `montadora` (
  `id` int NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `logotipo` varchar(255) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_alteracao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `montadora`
--

INSERT INTO `montadora` (`id`, `nome`, `logotipo`, `data_cadastro`, `data_alteracao`) VALUES
(1, 'Volkswagen', 'logo_volkswagen.png', '2023-04-26 16:35:16', '2023-05-04 01:17:47'),
(2, 'Toyota', 'logo_toyota.png', '2023-04-26 16:35:16', '2023-04-26 16:35:16'),
(3, 'Honda', 'logo_honda.png', '2023-04-26 16:35:16', '2023-04-26 16:35:16'),
(4, 'Ford', 'logo_ford.png', '2023-04-26 16:35:16', '2023-04-26 16:35:16'),
(5, 'Chevrolet', 'logo_chevrolet.png', '2023-04-26 16:35:16', '2023-04-26 16:35:16'),
(6, 'BMW', 'logo_bmw.png', '2023-04-26 16:57:20', '2023-04-26 16:57:20'),
(7, 'Fiat', 'logo_fiat.png', '2023-04-26 17:01:35', '2023-04-26 17:01:35'),
(8, 'Chrysler', 'logo_chrysler.png', '2023-05-04 00:39:20', '2023-05-04 00:39:20');

-- --------------------------------------------------------

--
-- Estrutura para tabela `veiculo`
--

CREATE TABLE `veiculo` (
  `id` int NOT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `ano_fabricacao` int DEFAULT NULL,
  `ano_modelo` int DEFAULT NULL,
  `cor` varchar(50) DEFAULT NULL,
  `num_portas` int DEFAULT NULL,
  `fotos` JSON DEFAULT NULL,
  `categoria_id` int DEFAULT NULL,
  `montadora_id` int DEFAULT NULL,
  `tipo_cambio` varchar(50) DEFAULT NULL,
  `tipo_direcao` varchar(50) DEFAULT NULL,
  `data_cadastro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_alteracao` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `veiculo`
--


--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tipo` (`tipo`);

--
-- Índices de tabela `montadora`
--
ALTER TABLE `montadora`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Índices de tabela `veiculo`
--
ALTER TABLE `veiculo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoria_id` (`categoria_id`),
  ADD KEY `montadora_id` (`montadora_id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `montadora`
--
ALTER TABLE `montadora`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `veiculo`
--
ALTER TABLE `veiculo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `veiculo`
--
ALTER TABLE `veiculo`
  ADD CONSTRAINT `veiculo_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria` (`id`),
  ADD CONSTRAINT `veiculo_ibfk_2` FOREIGN KEY (`montadora_id`) REFERENCES `montadora` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
