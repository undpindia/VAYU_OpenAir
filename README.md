![alt text](https://github.com/undpindia/VAYU_OpenAir/blob/main/vayu_logo.png?raw=true)


#  VAYU - OpenAir

VAYU - OpenAir is a public repository of open software, open algorithms and open data collected on air pollution through hyperlocal mapping of air pollution in two cities - Patna and Gurgaon.

This joint initiative by UNDP, GIZ, Govt, University of Nottingham, DA, D-Coop and a large number of citizen scientists in India. With open innovation framework, this initiative aims to model an 'Open Digital Stack on Air Pollution' for Indian cities. This initiative leaverages on open source softwares, crowdsources open data, IoT sensors for field data collection, and AI/ML for modeling purposes.

Our endeavor is to prototype 'Open Digital Stack on Air Pollution' that steers collective action across a wide range of stakeholders to combat air pollution. We are building a generalizable and scalable open source model that can be adopted by several cities across the world.


- [Project Stack](#)
- [Prerequisites](#Prerequisites)  
- [Deployment](#Deployment)  
   - [Mobile App](#MobileApp)  
        - [Configuration](#)  
        - [Depencdency Install](#)  
        - [Build](#)
   - [Web App](#)  
       - [Configuration](#)  
       - [Depencdency Install](#)
       - [Build](#)
   - [Backend](#)  
       - [Configuration](#)
       - [Depencdency Install](#)
       - [Database Migration](#) 
       - [Start application services](#)
- [Expose Application](#)
    - [Server blocks](#)
        - [Web app](#)
        - [Mobile app](#) 
        - [API](#)
    - [Initialize / Activate web server](#)
- [Data Science Team Members](#)

## Project Stack
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)![Celery](https://img.shields.io/badge/celery-%23a9cc54.svg?style=for-the-badge&logo=celery&logoColor=ddf4a4)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)![Ubuntu](https://img.shields.io/badge/Ubuntu-E95420?style=for-the-badge&logo=ubuntu&logoColor=white)

## Prerequisites

- OS : Ubuntu 22.04
    -  gcc, g++ 
    - make 
    - libsqlite3-dev 
    - zlib1g-dev
- Python 3.10 , python3.10-venv
- [Tippecanoe](https://github.com/felt/tippecanoe)
- Redis
- Node JS  v20.x 
- Postgress DB v15
- Nginx v1.18.x


## Deployment

- Clone the repository 
  ``` bash
  git clone <repo-url> vayu-openair
  ```

### Mobile App

- Environment / secrets update 
	```
	cd vayu-openair/vayu/mobile_app
	```
	 ```bash
	 nano .env
	 ```

    - Update the API URL
        ```
        VITE_REACT_API_URL='https://vayuapi.undp.org.in'
        ```

- Install Project dependencies 
	 ```bash
	npm install
	 ```

- Build the project 
   ```bash
   npm run build 
   ```


  
### Web App  
  

- Environment / secrets update   
	 
	 ```
	   cd vayu-openair/vayu/web_portal   
	 ``` 

	```
	nano .env
	```

     - Update the API URL  
		  ```  
		VITE_REACT_API_URL=https://vayuapi.undp.org.in/device/api/v1
		VITE_REACT_API_URL2=https://vayuapi.undp.org.in/mobile/api/v1
		  ```  
  
- Install Project dependencies   
  ```bash  
	npm install  
	 ```  
  
- Build the project   
  ```bash  
   npm run build   
   ```

### Backend 


- Environment / secrets update
	```  
	cd vayu-openair/vayu/api  
	```  
	```  
	cp env.sample .env  
	```
	```  
	nano .env  
	```

- Configure Virtual ENV for the project 
	```bash
	python3 -m venev venv 
	```
	```bash  
	source venv/bin/activate
	```	

- Install Project dependencies  
	```bash  
	pip install -r requirements.txt 
	```

- Prepare log directory 
	```bash
	mkdir logs
	```
- Database migration 

	```
	python manage.py makemigrations
	```
	```  
	python manage.py migrate  
	```
	```
	python manage.py migrate django_celery_beat
    python manage.py migrate django_celery_result
	```

- Start Celery as service ( Worker, Beat)

   
    `sudo nano /etc/systemd/system/celery.service`
    
	 ```
	 [Unit]
	Description=Celery Service
	After=network.target
	
	[Service]
	Type=simple
	User=your_user
	Group=your_group
	WorkingDirectory=/path/to/your/project
	ExecStart=/path/to/your/venv/bin/celery -A your_project_name worker --loglevel=INFO
	ExecStop=/bin/kill -s TERM $MAINPID
	Restart=on-failure
	
	[Install]
	WantedBy=multi-user.target

	 ```


	
	`sudo nano /etc/systemd/system/celery_beat.service`

	```
	[Unit]
	Description=Celery Beat Service
	After=network.target
	
	[Service]
	Type=simple
	User=your_user
	Group=your_group
	WorkingDirectory=/path/to/your/project
	ExecStart=/path/to/your/venv/bin/celery -A your_project_name beat --loglevel=INFO
	ExecStop=/bin/kill -s TERM $MAINPID
	Restart=on-failure
	
	[Install]
	WantedBy=multi-user.target
	```


> Update **User** , **Group** , **WorkingDirectory** , **ExecStart** with the actual path and value in the service file
> **Note** Path of the excutables will be in the virtual env created , so activating the virtual env and running `which app` returns the path , eg : `which celery` , `which gunicorn`


- Run the backend as system service 
	```bash
	sudo nano /etc/systemd/system/gunicorn.service
	```
	```
	[Unit]
	
	Description=Django Application Service
	After=network.target
	
	[Service]
	
	User=user
	Group=www-data
	WorkingDirectory=/home/user/undp-vayu/src/api/aq_undp
	ExecStart=/home/user/undp-vayu/src/api/env/bin/gunicorn --workers 3 --bind 0.0.0.0:8000 aq_undp.wsgi:application
	Restart=always
	
	[Install]
	WantedBy=multi-user.target
	```

> Update **User**  , **Group** , **WorkingDirectory** , **ExecStart** with the actual path and value in the service file 

- Reload systemctl 
	```
	sudo systemctl daemon-reload
	```

- Enable the service 
	```
	sudo systemctl enable gunicorn.service
	sudo systemctl enable celery
	sudo systemctl enable celery_beat
	```

- Start the service 
	```
	sudo systemctl start gunicorn.service
	sudo systemctl start celery.service
	sudo systemctl start celery_beat.service
	sudo systemctl start redis-server
	```

## Expose Application

#### Backend

- Create Nginx Server block for exposing the service 

	```
   nano /etc/nginx/sites-available/backend
  ```

> Replace **backend** with your custom domain name 

```
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
	location /static/ {
	 expires 30d; add_header Cache-Control "public, must-revalidate"; 
	 }
}
```

#### Mobile App

```nano /etc/nginx/sites-available/mobile-app```
```
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/your/react/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

```

#### Web App

```nano /etc/nginx/sites-available/web-app```

```  
server {
    listen 80;
    server_name yourdomain.com;

    root /path/to/your/react/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

```

> Replace **yourdomain.com** , **root** with custom domain name and build path

- Create a symbolic link to the `sites-enabled` directory:

	```
	sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
	```
> Similarly for other sites 

- Test the Nginx configuration

	```
	sudo nginx -t
	```
- Reload Nginx to apply the new configuration

	```
	sudo systemctl reload nginx
	sudo systemctl restart nginx
	```


## Key Data Science Team Members
1. [Swetha Kolluri](https://www.linkedin.com/in/swetha-kolluri/), Head of Experimentation, UNDP India
2. [Shubham Tandon](https://www.linkedin.com/in/shubham-tandon-b2b07026/), Program Officer, UNDP India
3. [Parvathy Krishnan](https://www.linkedin.com/in/parvathykrishnank/), Data Science Lead, UNDP India
4. [Renoy Girindran](https://www.linkedin.com/in/dr-renoy-girindran-phd-uk-1ab27a4a/), University of Nottingham
5. [Arun Kumar Yadav](https://www.linkedin.com/in/arun-kumar-yadav-60107a98/), Project Coordinator, UNDP India
6. [Ambarish Narayanan](https://www.linkedin.com/in/ambarishnarayanan/), CIO, mistEO
7. [Samuel John](https://www.linkedin.com/in/samuel-john-misteo/), Founder and CEO, mistEO
8. [Avinash Kumar](https://www.linkedin.com/in/avinash-kumar-59527879/), Programme Officer (Climate & Resource), Development Alternatives
   
