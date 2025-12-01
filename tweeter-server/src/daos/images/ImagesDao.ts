
export interface ImagesDao {
    putImage(fileName: string, encodedImage: string): Promise<string>
}
