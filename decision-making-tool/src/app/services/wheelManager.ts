import type { OptionsListItemsType } from '../types/OptionsListItemsType';
import type { WheelSection } from '../types/WheelSectionsType';

export class WheelManager {
  private readonly content: CanvasRenderingContext2D;
  private sections: WheelSection[] = [];
  private currentRotation: number = 0;
  private isSpinning: boolean = false;
  private spinStartTime: number = 0;
  private spinDuration: number = 5000;
  private selectedIndex: number = -1;
  private readonly totalWeight: number;
  private readonly centerX: number;
  private readonly centerY: number;
  private readonly radius: number;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly options: OptionsListItemsType[],
    private readonly onOptionChange: (option: OptionsListItemsType) => void,
    private readonly onSpinComplete: (option: OptionsListItemsType) => void,
  ) {
    this.content = canvas.getContext('2d')!;
    this.centerX = canvas.width / 2;
    this.centerY = canvas.height / 2;
    this.radius = this.centerX - 10;

    this.totalWeight = options.reduce((sum: number, option: OptionsListItemsType) => sum + option.weight, 0);
    this.initialize();
  }

  public spin(duration: number): void {
    if (this.isSpinning) return;

    this.isSpinning = true;
    this.spinDuration = duration * 1000;
    this.spinStartTime = Date.now();
    const startRotation: number = this.currentRotation;
    const totalSpins: number = 7;

    const selectedSection = this.sections[Math.floor(Math.random() * this.sections.length)];
    if (!selectedSection) return;
    const middleAngle = (selectedSection.startAngle + selectedSection.endAngle) / 2;
    const markerAngle = -Math.PI / 2;
    let targetRotation = totalSpins * 2 * Math.PI + middleAngle - markerAngle;

    const animate = (): void => {
      if (!this.isSpinning) return;

      const progress: number = (Date.now() - this.spinStartTime) / this.spinDuration;
      if (progress >= 1) {
        this.currentRotation = targetRotation % (2 * Math.PI);
        this.isSpinning = false;
        this.draw();

        const selected: OptionsListItemsType | null = this.getSelectedOption();
        if (selected) this.onSpinComplete(selected);
        return;
      }

      const easedProgress: number = progress * (2 - progress);
      this.currentRotation = startRotation + easedProgress * (targetRotation - startRotation);
      this.draw();
      this.updateSelectedOption();
      requestAnimationFrame(animate);
    };

    animate();
  }

  private initialize(): void {
    const randomizedOptions: OptionsListItemsType[] = [...this.options].sort(() => Math.random() - 0.5);
    let startAngle: number = 0;

    randomizedOptions.forEach((option: OptionsListItemsType): void => {
      const sectionAngle: number = (option.weight / this.totalWeight) * 2 * Math.PI;
      this.sections.push({
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        startAngle,
        endAngle: startAngle + sectionAngle,
        option,
      });
      startAngle += sectionAngle;
    });

    this.draw();
  }

  private draw(): void {
    this.clearCanvas();
    this.drawSections();
    this.drawCenterCircle();
    this.drawPointer();
  }

  private clearCanvas(): void {
    this.content.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawSections(): void {
    this.sections.forEach((section: WheelSection): void => {
      this.drawSection(section);
      this.drawSectionText(section);
    });
  }

  private drawSection(section: WheelSection): void {
    this.content.beginPath();
    this.content.moveTo(this.centerX, this.centerY);
    this.content.arc(
      this.centerX,
      this.centerY,
      this.radius,
      section.startAngle + this.currentRotation,
      section.endAngle + this.currentRotation,
    );
    this.content.fillStyle = section.color;
    this.content.fill();

    this.content.strokeStyle = '#333';
    this.content.lineWidth = 2;
    this.content.stroke();
  }

  private drawSectionText(section: WheelSection): void {
    const midAngle: number = (section.startAngle + section.endAngle) / 2 + this.currentRotation;
    const textRadius: number = this.radius * 0.65;

    this.content.save();
    const textX: number = this.centerX + Math.cos(midAngle) * textRadius;
    const textY: number = this.centerY + Math.sin(midAngle) * textRadius;
    this.content.translate(textX, textY);
    this.content.rotate(midAngle + Math.PI / 2);

    this.content.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.content.font = '16px Arial';
    this.content.textAlign = 'center';
    this.content.textBaseline = 'middle';

    const maxWidth: number = this.radius * 0.5;
    const text: string = this.fitText(section.option.title, maxWidth);
    this.content.fillText(text, 0, 0);
    this.content.restore();
  }

  private drawCenterCircle(): void {
    this.content.beginPath();
    this.content.arc(this.centerX, this.centerY, 20, 0, 2 * Math.PI);
    this.content.fillStyle = '#fff';
    this.content.fill();
    this.content.strokeStyle = '#333';
    this.content.lineWidth = 3;
    this.content.stroke();
  }

  private drawPointer(): void {
    const pointerHeight: number = 20;
    const pointerWidth: number = 30;
    const offsetY: number = 10;

    this.content.beginPath();
    this.content.moveTo(this.centerX, this.centerY - this.radius + 2 * offsetY);
    this.content.lineTo(this.centerX + pointerWidth / 2, this.centerY - this.radius + offsetY - pointerHeight);
    this.content.lineTo(this.centerX - pointerWidth / 2, this.centerY - this.radius + offsetY - pointerHeight);
    this.content.closePath();

    this.content.fillStyle = '#638484';
    this.content.fill();

    this.content.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.content.shadowBlur = 5;
    this.content.shadowOffsetX = 2;
    this.content.shadowOffsetY = 2;
    this.content.fill();
    this.content.shadowColor = 'transparent';
  }

  private fitText(text: string, maxWidth: number): string {
    this.content.font = '16px Arial';
    let metrics: TextMetrics = this.content.measureText(text);
    if (metrics.width <= maxWidth) return text;

    while (text.length > 0 && metrics.width > maxWidth) {
      text = text.slice(0, -1);
      metrics = this.content.measureText(text + '...');
    }
    return text + '...';
  }

  private updateSelectedOption(): void {
    let angle: number = this.currentRotation % (2 * Math.PI);
    if (angle < 0) angle += 2 * Math.PI;

    const selectedSection: WheelSection | undefined = this.sections.find(
      (section: WheelSection): boolean => angle >= section.startAngle && angle < section.endAngle,
    );

    if (selectedSection) {
      const newIndex: number = this.sections.indexOf(selectedSection);
      if (this.selectedIndex !== newIndex) {
        this.selectedIndex = newIndex;
        this.onOptionChange(selectedSection.option);
      }
    }
  }

  private getSelectedOption(): OptionsListItemsType | null {
    let angle: number = ((-this.currentRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    const markerAngle: number = -Math.PI / 2;

    const selectedSection: WheelSection | undefined = this.sections.find(
      (section: WheelSection): boolean =>
        angle >= (section.startAngle + markerAngle) % (2 * Math.PI) &&
        angle < (section.endAngle + markerAngle) % (2 * Math.PI),
    );

    return selectedSection ? selectedSection.option : null;
  }
}
