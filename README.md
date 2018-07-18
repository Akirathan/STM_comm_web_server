# STM server
## Overview
This repository contains an implementation of web server that communicates with thermostat
(firmware for this thermostat device is in my other repository -
[STM32-smart-heating](https://github.com/Akirathan/STM32-smart-heating))
and lets the user read actual temperature and set intervals into the thermostat via this web server.

It is built with Django backend framework and yet contains no frontend framework.

This server is divided into two components (applications in Django's terminology) - `stm_comm`
and `user_interface`, where `stm_comm` is a component that takes care of the communication
with the thermostat and `user_interface` takes care of communication with the user.

Functionality of the whole server is pretty straight-forward and database-oriented.
For more information refer to comments in the code.

## Directory structure

These components have their own directories with similar structure.
`models.py` file (or files with similar name) contains definitions of database models (see
Django models for more information).

`views.py` file (or files with similar name) contains functions that are used to serve
various requests - in `user_interface` application these functions process requests from
user's browser and typically sends a HTML page in a response (in Django terminology:
"renders a HTML template page") and in `stm_comm` application these functions process
requests from device's requests and sends HTTP response, sometimes with a specific body.
Note that the communication with the device is encrypted with DES encryption.

`urls.py` file contains mapping from URLs to view functions.

`static` directory contains static files - mostly js files (Bootstrap, jQuery, ...).

`templates` directory contains all HTML template pages.

Finally, `venv` directory contains Python's virtual environment with Django installed.
Note that by default `venv` is not tracked by Git.

### Database
There is an SQLite database in root directory that is used as an intermediate between
`stm_comm` and `user_interface` components.
The sqlite database is tracked by Git, there is one device and one user in this database.
Feel free to explore the database either via `sqlite3 db.sqlite3` or via Django's API.
Invoke Django shell (normal Python shell with some imports) with:
`./venv/bin/python3 manage.py shell`, import `stm_comm.models` and for more information
refer to Django's documentation.

## Running the server
I developed the whole server on my machine, if you want to run the server on your own
machine you have to make some arrangements:
- Clone the whole repository
- Create virtual environment
    - with something like: `python3 -m venv ./venv`
- Install Django and other dependencies into your virtual environment
    - `./venv/bin/pip3 install Django pyDes`
- Other directories may remain without any change, maybe you will have to remove
  `__pycache__` subdirectories.
- Before running server, do some checks
    - `./venv/bin/python3 manage.py check`
- And finally run the server
    - `./venv/bin/python3 manage.py runserver 8000`

