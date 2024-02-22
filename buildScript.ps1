$originManifestJson = "./manifest.json"
$originCssFile = "./extension-logic/src/styles/index.css"
$originAssets = "./assets/*"

$targetCss = "./build/css"
$targetAssets = "./build/assets"

$buildFodlerPath = "./build"
$subfolders = @("./css", "./js")

$extensionPath = "./extension-logic"
$popupPath = "./popup"

# Create build folder
if (Test-Path -Path $buildFodlerPath -PathType Container) {
    Remove-Item -Path "$buildFodlerPath\*" -Recurse -Force
    Write-Host "Contents in folder '$buildFodlerPath' removed."
}
else {
    New-Item -Path $buildFodlerPath -ItemType Directory
    Write-Host "Folder '$buildFodlerPath' created."
}

#Create Subfolders of bin
foreach ($subfolder in $subfolders) {
    $subfolderPath = Join-Path -Path $buildFodlerPath -ChildPath $subfolder
    New-Item -Path $subfolderPath -ItemType Directory
}

Copy-Item -Path $originManifestJson -Destination $buildFodlerPath
Copy-Item -Path $originCssFile -Destination $targetCss
# Copy-Item -Path $originAssets -Destination $targetAssets -Recurse

Set-Location -Path $extensionPath
npm install
npm run build

Set-Location -Path ".."

Set-Location -Path $popupPath
npm install
npm run build

Set-Location -Path ".."

# Move build files to the correct folder
Move-Item -Path "./popup/dist/*" -Destination "./build/" -Force
Move-Item -Path "./extension-logic/dist/*" -Destination "./build/js"

Copy-Item -Path $originAssets -Destination $targetAssets -Recurse