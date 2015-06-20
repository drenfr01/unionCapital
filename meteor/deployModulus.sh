#!/bin/bash

PROD_PROJECT_NAME="UnionCapital"
QA_PROJECT_NAME="Union Capital QA"

# read -p "Deploy what branch? [default=origin/master]" branch
read -p "Deploy which environment? [prod/qa]" -i "qa" env
case $env in
    prod )
        export PROJ=$PROD_PROJECT_NAME;;
    qa )
        export PROJ=$QA_PROJECT_NAME;;
    * ) echo "Enter 'prod' or 'qa'"
        exit;;
esac

modulus deploy -p "$PROJ" || exit

git fetch --tags
git checkout $env
git tag -f "$env-rollback"
# checkout - checks out the last commit you were on, good for flipping back and forth
git checkout -
git tag -f $env
git push --tags -f

whoami >> email
date >> email
echo "Thanks for deploying, below is the changelog for this deploy:"
git log --oneline "$env-rollback..$env" >> email
cat email | mail -s "Union Capital $env Deploy Complete" $(cat maintainerS)
rm email

exit
