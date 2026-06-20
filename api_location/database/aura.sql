-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 20 juin 2026 à 17:25
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `aura`
--

-- --------------------------------------------------------

--
-- Structure de la table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `cne` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `phone`, `cne`, `message`, `is_read`, `created_at`) VALUES
(5, 'rtyuiop^$', 'e\'r(tyuiop', '8520', 'ê\'(rt-yèu_iop^$e(rtyuiop^myèrue_zdiopl^mùezdyèuijkl;', 0, '2026-06-20 12:03:16');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(50) DEFAULT NULL,
  `role` varchar(20) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `reservation_id`, `message`, `is_read`, `created_at`, `type`, `role`, `title`) VALUES
(17, 6, 13, 'notifications.client.reservationCreatedByAdmin.message', 0, '2026-06-19 11:08:33', 'reservationCreatedByAdmin', 'client', 'notifications.client.reservationCreatedByAdmin.title'),
(18, 5, 14, 'notifications.client.reservationCreatedByAdmin.message', 0, '2026-06-19 12:12:56', 'reservationCreatedByAdmin', 'client', 'notifications.client.reservationCreatedByAdmin.title'),
(19, 5, 15, 'notifications.client.reservationCreatedByAdmin.message', 0, '2026-06-19 15:20:50', 'reservationCreatedByAdmin', 'client', 'notifications.client.reservationCreatedByAdmin.title'),
(20, 5, 15, 'notifications.client.reservationCompleted.message', 0, '2026-06-20 09:49:23', 'reservationCompleted', 'client', 'notifications.client.reservationCompleted.title'),
(21, 5, 14, 'notifications.client.reservationCompleted.message', 0, '2026-06-20 14:29:11', 'reservationCompleted', 'client', 'notifications.client.reservationCompleted.title');

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `voiture_id` int(11) NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `statut` enum('en_attente','confirmée','annulée','terminée') NOT NULL DEFAULT 'en_attente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `reservation`
--

INSERT INTO `reservation` (`id`, `user_id`, `voiture_id`, `date_debut`, `date_fin`, `statut`, `created_at`) VALUES
(13, 6, 1, '2026-06-26', '2026-06-29', 'confirmée', '2026-06-19 11:08:33'),
(14, 5, 2, '2026-06-20', '2026-06-26', 'terminée', '2026-06-19 12:12:56'),
(15, 5, 5, '2026-06-19', '2026-06-20', 'terminée', '2026-06-19 15:20:50');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `CNE` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','client') NOT NULL DEFAULT 'client',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `CNE`, `password`, `role`, `created_at`) VALUES
(1, 'rachid', '0650647291', 'E342238', '$2b$10$m5Ljrd03O76ac2fQFXebGew2qGPMNxDz.k7oBxc6nojjwIXD/gbRe', 'admin', '2025-08-12 13:10:18'),
(2, 'ahmed', '0622222222', '20252027', '$2b$10$TlA3OPQfSfgDZxkIryN/COPrIA27S7Dg3IEs2tYgDe3orlXDlbToy', 'admin', '2025-08-12 13:10:18'),
(4, 'Ahmed BEN AMMI', '0612345678', 'M123456', '$2b$10$zaumTk/qpGlYsK9sUj6X7O84QPIk5o1zkIygSaGadOG1tV5wxEVN.', 'admin', '2026-06-08 15:01:32'),
(5, 'zohir', '0639109529', 'Z123456', '$2b$10$eUJGd0tYBu82zxhl7BEzJ.ZKywEfY4DIh9COmT7mv2f7TDlpLnYp.', 'client', '2026-06-09 14:15:38'),
(6, 'Yassine El Idrissi', '0678123456', 'Y987654', '$2b$10$g6zxQeND.NiANoA8HLZBB.CplSVEHRxfhMSyfuTpHqm2UzBdv8P/O', 'client', '2026-06-09 15:36:25'),
(7, 'Test2', '0987654321', 'TESTCNE456', '$2b$10$nx5wZWL1qk99cK4yzsVPxu2oOVdABzzjtQGlZe1JJwWDcvas1uki6', 'client', '2026-06-12 16:14:26'),
(8, 'Karim Test', '0677001122', 'K987654', '$2b$10$x00m2NVYdrQHx5.ANo.vPen1Mao0PkSZNiS6sT/aCeWNdTFeuWnj6', 'client', '2026-06-12 16:24:50'),
(9, 'fghjkl', 'fghjkl', 'ic12', '$2b$10$pvpW/Dp.Ktvoq46GbP9Rve7DjdPk1QJiCeZhPY5SjwNPMtC/hicAK', 'client', '2026-06-18 15:03:04'),
(10, 'bb', '0612121212', 'bb12', '$2b$10$42.CwjLSxfqKM47qVg0dDuZ6w9MGoNnNypYA6zVDcI28OC7K6k2uW', 'admin', '2026-06-20 14:16:25');

-- --------------------------------------------------------

--
-- Structure de la table `voitures`
--

CREATE TABLE `voitures` (
  `id` int(11) NOT NULL,
  `marque` varchar(255) NOT NULL,
  `modele` varchar(255) NOT NULL,
  `annee` year(4) NOT NULL,
  `numero_immatriculation` varchar(255) NOT NULL,
  `statut` enum('disponible','reservée','en_maintenance') NOT NULL,
  `image` varchar(255) NOT NULL,
  `prix_par_jour` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `voitures`
--

INSERT INTO `voitures` (`id`, `marque`, `modele`, `annee`, `numero_immatriculation`, `statut`, `image`, `prix_par_jour`) VALUES
(1, 'Peugeot', 'logan', '2012', 'EF-456-GH', 'reservée', '1781603304860.png', 250.00),
(2, 'Renault', 'Clio', '2022', 'AX-123-Bcr', 'disponible', '1781601969301.png', 100.00),
(3, 'Toyota', 'Corolla', '2022', 'AB-123-DD', 'disponible', '1781603283318.png', 500.00),
(5, 'rtyu', 'rtyui', '2026', 'drtfyghujk', 'disponible', '1781603265892.png', 500.00),
(6, 'dfghj', 'fghjk', '2026', '85245', 'disponible', '1781601740182.png', 500.00),
(7, 'ertyuhio', 'tryuhjiko', '2026', 'zertyui', 'disponible', '1781863167150.png', 500.00);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reservation_id` (`reservation_id`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `voiture_id` (`voiture_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_cne` (`CNE`);

--
-- Index pour la table `voitures`
--
ALTER TABLE `voitures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero_immatriculation` (`numero_immatriculation`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `voitures`
--
ALTER TABLE `voitures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`voiture_id`) REFERENCES `voitures` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
