#!/bin/bash

set -e

PROD_PROJECT_NAME="UnionCapital"
QA_PROJECT_NAME="Union Capital QA"

read -p "Deploy what branch? [e.g. 'origin/master'] " branch
if [ $branch != 'origin/master' ]; then
    read -p "Are you sure you want to deploy to $branch? [y/n]" confirm
    if [ $confirm != 'y' ]; then
        echo 'Branch not confirmed, exiting';
        exit;
    fi
fi
read -p "Deploy which environment? [prod/qa]" env
case $env in
    prod )
        export PROJ=$PROD_PROJECT_NAME;;
    qa )
        export PROJ=$QA_PROJECT_NAME;;
    * ) echo "Enter 'prod' or 'qa'"
        exit;;
esac

# Checkout the branch for deploy
git checkout $branch 
modulus deploy -p "$PROJ" 

git fetch --tags

#Checkout the previous tag for this environment
git checkout $env
git tag -f "$env-rollback"
# checkout - checks out the last commit you were on, good for flipping back and forth
git checkout $branch
git tag -f $env
git push --tags -f

whoami >> email
echo "\n" >> email
date >> email
echo "\nThanks for deploying, below is the changelog for this deploy:"
git log --oneline "$env-rollback..$env" >> email
cat email | mail -s "Union Capital $env Deploy Complete" $(cat maintainers)
rm email

exit
