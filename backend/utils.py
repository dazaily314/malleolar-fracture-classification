from torchvision import transforms

def transform_image(image):
    """
    Applique les transformations nécessaires à l'image avant
    de la passer dans le modèle ResNet.
    ResNet attend des images de taille 224x224 normalisées
    avec les moyennes et écart-types d'ImageNet.
    """
    my_transforms = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
    
    return my_transforms(image)
