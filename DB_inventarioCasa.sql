create database inventarioCasa;
use inventarioCasa;

create table productos(
idProducto int unsigned  not null auto_increment,
nombreProducto varchar(200) not null,
stockProducto int not null,
estadoPoco varchar(200),
estadoModerado varchar(200) ,
estadoMucho varchar(200),
primary key(idProducto)
); 

insert into productos values(null, "Aceite", 69);


drop table productos;
