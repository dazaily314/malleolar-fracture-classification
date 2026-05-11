import torch
import torch.nn as nn
from torchvision.models import resnet50, ResNet50_Weights

from labels import NUM_CLASSES


class FractureModel(nn.Module):
    def __init__(self, num_classes: int = NUM_CLASSES):
        super(FractureModel, self).__init__()
        # Utilisation de ResNet50 pré-entraîné
        # weights=ResNet50_Weights.DEFAULT charge les poids ImageNet
        self.base_model = resnet50(weights=ResNet50_Weights.DEFAULT)

        # Dernière couche FC alignée sur NUM_CLASSES (Weber A / B / C)
        num_ftrs = self.base_model.fc.in_features
        self.base_model.fc = nn.Linear(num_ftrs, num_classes)

        # NOTE: Avant entraînement sur vos données, sorties non calibrées.

    def forward(self, x):
        return self.base_model(x)

if __name__ == "__main__":
    # Test basique du modèle
    model = FractureModel()
    dummy_input = torch.randn(1, 3, 224, 224)
    output = model(dummy_input)
    print("Output shape:", output.shape)  # [1, NUM_CLASSES]
