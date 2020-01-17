Param($server, $account, $password, $artifact, $path)

echo "Connecting to server $server .."
Set-Item WSMan:\localhost\Client\TrustedHosts -Value $server -Force
$password = ConvertTo-SecureString -AsPlainText $password -Force
$credential = New-Object System.Management.Automation.PSCredential -ArgumentList $account, $password
$session = New-PSSession -ComputerName $server -Credential $credential

echo "Deploying artifact to $path .."
Compress-Archive -Path "$artifact\*" -DestinationPath 'artifact.zip' -Force
Copy-Item '.\artifact.zip' -Destination 'C:\artifact.zip' -ToSession $session
Invoke-Command -Session $session -ScriptBlock {
  Param($path)
  Expand-Archive -Path 'C:\artifact.zip' -DestinationPath $path -Force
  Remove-Item -Path 'C:\artifact.zip'
} -ArgumentList $path

Remove-PSSession -Session $session
echo 'Done'
