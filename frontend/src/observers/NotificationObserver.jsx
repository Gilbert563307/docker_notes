//DOCS https://github.com/HU-SD-S3/s3-kennisbank/blob/main/frontend/data-exchange/observables.md
/**
 * Service for managing data notifications to subscribers.
 * Implements a simple observer pattern.
 */
export class NotificationObserver {

    /**
     * Stored data items to be sent to subscribers.
     * @type {Array<any>}
     */
    #serviceData = [];

    /**
     * List of subscribed observers.
     * Each observer must have a `next` method that receives data.
     * @type {Array<{ next: (data: any) => void }>}
     */
    #subscribers = [];

    /**
     * Adds a new data item and notifies all subscribers.
     * @param {any} item - The data item to add.
     */
    addData(item) {
        this.#serviceData = [...new Array(item)];
        this.notify(this.#serviceData);
    }


    /** Clears the service data  */
    clear() {
        this.#serviceData.pop();
    }

    /**
     * Subscribes an observer to receive updates.
     * @param {{ next: (data: any) => void }} observer - The observer to subscribe.
     */
    subscribe(observer) {
        this.#subscribers = [...this.#subscribers, observer];
    }

    /**
     * Unsubscribes an observer from receiving updates.
     * @param {{ next: (data: any) => void }} observer - The observer to remove.
     */
    unsubscribe(observer) {
        this.#subscribers = this.#subscribers.filter(sub => sub !== observer);
    }

    /**
     * Notifies all subscribed observers with the given data.
     * @param {any} data - The data to send to observers.
     */
    notify(data) {
        this.#subscribers.forEach(observer => observer.next(data));
    }
}

/** Singleton instance of NotificationSubjectService */
const notificationObserver = new NotificationObserver();
export { notificationObserver };
