-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Jan 11. 11:52
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `sopnodeserver`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`) VALUES
(1, 'alma', '$2b$10$YXTeyOU8X6ZlSK8Z7izwrOvDmEumF1ZfN2bijaRcQ16Va6MGHOJNi'),
(3, 'beka', '$2b$10$PUsaZCtVyRaqxfDSPcVjtOu/7K1XqbfTYJhK8FVtevBR7CxBnhsIS'),
(4, '1234', '$2b$10$T52g07DLe0oIWlsS81hWbOXs4Ks/Vp6fskURfgOm2MmwpO8afP5JK'),
(5, 'string', '$2b$10$Pryug944CfrRKP90BOwtzeFzbe..ElzmLZKcwg3OXbqDu6aNjigrK'),
(6, '1235', '$2b$10$5uYB1H9IDzDaNq68PF93I.Iulk0oJMNO4nT5EjUpkUFkAIZzdwbDq'),
(7, 'tamas', '$2b$10$SCuPifIqst/7O/X1rXozEOIf71CZKzCze04YabM7lUG9DxsqJ8Cva');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
