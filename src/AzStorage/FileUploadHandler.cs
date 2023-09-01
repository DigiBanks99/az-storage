using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;

namespace AzStorage;

public class FileUploadHandler
{
    private readonly BlobContainerClient _client;

    public FileUploadHandler([FromKeyedServices("file")] BlobContainerClient client)
    {
        _client = client;
    }

    public async Task<string> Handle(IFormFile file)
    {
        BlobClient blobClient = _client.GetBlobClient(file.FileName);
        await using Stream stream = file.OpenReadStream();
        await _client.UploadBlobAsync(file.FileName, stream);
        await blobClient.SetHttpHeadersAsync(new BlobHttpHeaders
        {
            ContentType = file.ContentType
        });
        await blobClient.SetAccessTierAsync(AccessTier.Cool);
        Uri? uri = blobClient.GenerateSasUri(
            BlobSasPermissions.List | BlobSasPermissions.Read,
            DateTimeOffset.UtcNow.AddDays(1));
        return uri.ToString();
    }
}