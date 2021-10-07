<?php

class DownloadResponse
{
    /**
     * The response filepath
     * 
     * @var string
     */
    protected string $filepath;

    /**
     * Current response headers
     * 
     * @var array
     */
    protected array $headers = [];

    /**
     * Perform a download response
     * 
     * @param string $filepath
     * @return void
     */
    public function __construct(string $filepath)
    {
        $this->filepath = $filepath;
        $this->setHeaders()->sendResponse();
    }

    /**
     * Set the response headers
     * 
     * @return self
     */
    protected function setHeaders(): self
    {
        $this->addHeader('Content-Type', mime_content_type($this->filepath))
            ->addHeader('Content-Length', filesize($this->filepath))
            ->addHeader('Accept-Ranges', 'bytes')
            ->addHeader('Pragma', 'no-cache')
            ->addHeader(
                'Content-Disposition',
                "attachment; filename=\"{$this->getFilename()}\""
            );

        return $this;
    }

    /**
     * Get the current filename
     * 
     * @return string
     */
    protected function getFilename(): string
    {
        return basename(
            \preg_replace('#/.*/#', '', $this->filepath)
        );
    }

    /**
     * Perform the download response
     * 
     * @return void
     */
    protected function sendResponse(): void
    {
        if (!headers_sent()) {

            foreach ($this->headers as $value) {
                header($value, true);
            }

            readfile($this->filepath);
        }
    }

    /**
     * Add a new header for the response
     * 
     * @param string $name
     * @param string $value
     * @return self
     */
    protected function addHeader(string $name, string $value): self
    {
        $this->headers[$name] = "$name: $value";

        return $this;
    }
}
