using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace AzStorage;

public class FileInfoHandler
{
    private readonly BlobContainerClient _client;

    public FileInfoHandler([FromKeyedServices("file")] BlobContainerClient client)
    {
        _client = client;
    }

    public async IAsyncEnumerable<AzFileInfo> GetAll()
    {
        AsyncPageable<BlobItem>? blobs = _client.GetBlobsAsync();

        await foreach (BlobItem blob in blobs)
        {
            yield return new AzFileInfo(blob.Name,
                blob.Properties.ContentType,
                blob.Properties.ContentLength ?? 0);
        }
    }

    public async Task<(Stream stream, string contentType)> Download(string fileName)
    {
        BlobClient? blobClient = _client.GetBlobClient(fileName);
        Response<BlobDownloadStreamingResult>? response = await blobClient.DownloadStreamingAsync(new BlobDownloadOptions());

        return (response.Value.Content, response.Value.Details.ContentType);
    }
}