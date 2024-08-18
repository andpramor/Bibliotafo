#!/bin/bash

for file in fixtures/testing_data/*.json
do
  python manage.py loaddata $file
done