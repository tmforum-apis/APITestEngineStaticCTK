#!/bin/bash
# Use CLI tool to compare two files in the original swagger versions, then convert the files to 0as3 and compare again
# example usage: ./testSwagger2vsOAS3.sh ES/TMF681-CommunicationManagement.swagger.json
/bin/echo -e "\e[1;33mCompare compliance results for the 2.0 and 3.0 versions of the same swagger\e[0m"
if [[ ${PWD##*/} != "oas3" ]];
then
    /bin/echo -e "Script must be executed in VFGroup-APITestEngine-StaticCTK/samples/test/oas3"
    exit 1
fi
if [ `npm list -g | grep -c swagger2openapi` -eq 0 ]; then
    /bin/echo -e "Please install swagger2openapi using: npm install -g swagger2openapi"
    exit 1
fi
# Get the TMF Official file
filename=$(basename -- "$1")
TMFspec=${filename:0:6}
TMFOfficalDir=../../../test/samples/tmf-official
files=(${TMFOfficalDir}/${TMFspec}*)
officialFile="${files[0]}"
if [ ! -e "${files-}" ];
then
    /bin/echo -e "TMF Official file not found for ${TMFspec} at ${TMFOfficalDir}"
    exit 1
fi
# Compare the original files
/bin/echo -e "Comparing $1 with "
/bin/echo -e "        ${officialFile} "
currentDir=${PWD}
cd ../../..
node src/index.js -c ${currentDir}/${officialFile} ${currentDir}/$1 > /tmp/original.txt
cd ${currentDir}
# Convert the input file using node module swagger2openapi
converted=${1/swagger/swagger\.converted}
/bin/echo -e "Converting $1 to ${converted} "
swagger2openapi $1 -o ${converted}
# Convert the TMF file using node module swagger2openapi
convertedOfficial=${officialFile/swagger/swagger\.converted}
/bin/echo -e "Converting ${officialFile} to ${convertedOfficial} "
swagger2openapi ${officialFile} -o ${convertedOfficial}
# Compare the converted files
/bin/echo -e "Comparing ${converted} with "
/bin/echo -e "        ${convertedOfficial} "
cd ../../..
node src/index.js -c  ${currentDir}/${convertedOfficial} ${currentDir}/${converted} > /tmp/converted.txt
cd ${currentDir}
# diff the results of the two conversions
/bin/echo -e "\e[1;33mDiff the compliance checks for the original and the converted\e[0m"
diff /tmp/original.txt /tmp/converted.txt
# Remove the converted files
/bin/echo -e "Removing converted files"
rm -rf ${converted}
rm -rf ${convertedOfficial}

