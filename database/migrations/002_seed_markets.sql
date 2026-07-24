insert into public.markets(code,name,category) values
('1','Pobeda domaćina','Ishod'),('X','Nerešeno','Ishod'),('2','Pobeda gosta','Ishod'),
('1X','Dupla šansa 1X','Ishod'),('X2','Dupla šansa X2','Ishod'),('12','Dupla šansa 12','Ishod'),
('DNB_HOME','Domaćin bez nerešenog','Ishod'),('DNB_AWAY','Gost bez nerešenog','Ishod'),
('O05','Više od 0,5 gola','Golovi'),('O15','Više od 1,5 gola','Golovi'),('O25','Više od 2,5 gola','Golovi'),
('O35','Više od 3,5 gola','Golovi'),('U15','Manje od 1,5 gola','Golovi'),('U25','Manje od 2,5 gola','Golovi'),
('U35','Manje od 3,5 gola','Golovi'),('BTTS_Y','Oba tima daju gol','Golovi'),('BTTS_N','Oba tima ne daju gol','Golovi'),
('FH_O05','Prvo poluvreme više od 0,5','Poluvreme'),('FH_O15','Prvo poluvreme više od 1,5','Poluvreme'),
('CORNERS_O85','Više od 8,5 kornera','Korneri'),('CARDS_O35','Više od 3,5 kartona','Kartoni'),
('AH_HOME','Azijski hendikep domaćin','Hendikep'),('EH_HOME','Evropski hendikep domaćin','Hendikep')
on conflict(code) do nothing;
