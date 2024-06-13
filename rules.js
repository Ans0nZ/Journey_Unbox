class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story", { Text: "Begin the story", Target: this.engine.storyData.InitialLocation });
    }

    handleChoice(choice) {
        this.engine.state = { collectedGems: [], hiddenChoiceAdded: false }; 
        this.engine.gotoScene(Location, choice.Target);
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);

        if (locationData.Gem && !this.engine.state.collectedGems.includes(locationData.Gem)) {
            this.engine.state.collectedGems.push(locationData.Gem);
        }

        if (locationData.Choices && locationData.Choices.length > 0) {
            for (let choice of locationData.Choices) {
                if (!choice.Condition || this.checkCondition(choice.Condition)) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end.", null);
        }

        
        if (key === this.engine.storyData.InitialLocation && this.checkAllGemsCollected() && !this.engine.state.hiddenChoiceAdded) {
            //this.engine.addChoice("Hidden", { Text: "Hidden", Target: "HiddenLevel" });
            this.engine.state.hiddenChoiceAdded = true; 
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }

    checkAllGemsCollected() {
        const allGems = ["w", "a", "o", "i", "n", "i2"];
        return allGems.every(gem => this.engine.state.collectedGems.includes(gem));
    }

    checkCondition(condition) {
        if (condition === "allGemsCollected") {
            return this.checkAllGemsCollected();
        }
        return false;
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
